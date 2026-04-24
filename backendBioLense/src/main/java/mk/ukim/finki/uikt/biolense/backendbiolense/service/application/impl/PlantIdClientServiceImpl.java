package mk.ukim.finki.uikt.biolense.backendbiolense.service.application.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mk.ukim.finki.uikt.biolense.backendbiolense.dtos.plantId.request.PlantIdApiRequest;
import mk.ukim.finki.uikt.biolense.backendbiolense.dtos.plantId.response.PlantIdResponse;
import mk.ukim.finki.uikt.biolense.backendbiolense.dtos.plantId.response.PlantIdUsageResponse;
import mk.ukim.finki.uikt.biolense.backendbiolense.helpers.ImageHashUtil;
import mk.ukim.finki.uikt.biolense.backendbiolense.models.PlantApiCache;
import mk.ukim.finki.uikt.biolense.backendbiolense.service.application.PlantIdCacheService;
import mk.ukim.finki.uikt.biolense.backendbiolense.service.application.PlantIdClientService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.Collections;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class PlantIdClientServiceImpl implements PlantIdClientService {

    @Value("${plant.id.api.key}")
    private String apiKey;

    private static final String BASE_URL = "https://plant.id/api/v3/";

    private final RestTemplate restTemplate = new RestTemplate();
    private final PlantIdCacheService cacheService;

    /**
     * Single shared method — health mode drives the behavior.
     *
     * Before hitting the external API, the cache is checked using the image hash
     * and GPS coordinates. On a cache miss the API is called and the result stored.
     *
     * https://plant.id/api/v3/identification?health=all  → ID + health (+2 credits)
     * https://plant.id/api/v3/identification?health=auto → ID + health if sick (+1-2 credits)
     * https://plant.id/api/v3/identification?health=only → health only (+1 credit)
     * health = null                                       → identification only (+1 credit)
     */
    private PlantIdResponse callIdentificationEndpoint(
            MultipartFile image, String healthMode,
            Double latitude, Double longitude, boolean similarImages) throws IOException {

        byte[] imageBytes = image.getBytes();
        String imageHash = ImageHashUtil.sha256(imageBytes);
        PlantApiCache.RequestType requestType = resolveRequestType(healthMode);

        // ── 1. Cache lookup ──────────────────────────────────────────────────
        Optional<PlantIdResponse> cached = cacheService.lookup(requestType, imageHash, latitude, longitude);
        if (cached.isPresent()) {
            log.info("Cache HIT [type={}, imageHash={}, lat={}, lon={}]",
                    requestType, imageHash, latitude, longitude);
            return cached.get();
        }
        log.info("Cache MISS — calling Plant.id [type={}, imageHash={}, lat={}, lon={}]",
                requestType, imageHash, latitude, longitude);

        // ── 2. External API call ─────────────────────────────────────────────
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Api-Key", apiKey);

        String base64Image = Base64.getEncoder().encodeToString(imageBytes);

        PlantIdApiRequest requestBody = PlantIdApiRequest.builder()
                .images(Collections.singletonList("data:image/jpeg;base64," + base64Image))
                .latitude(latitude)
                .longitude(longitude)
                .build();

        HttpEntity<PlantIdApiRequest> request = new HttpEntity<>(requestBody, headers);

        StringBuilder url = new StringBuilder(BASE_URL)
                .append("identification?similar_images=").append(similarImages);
        if (healthMode != null) {
            url.append("&health=").append(healthMode);
        }

        log.info("Calling Plant.id [health={}] → {}", healthMode, url);

        PlantIdResponse response = restTemplate.postForObject(url.toString(), request, PlantIdResponse.class);

        // ── 3. Persist to cache ──────────────────────────────────────────────
        if (response != null) {
            cacheService.store(requestType, imageHash, latitude, longitude, response);
        }

        return response;
    }

    /** Maps a Plant.id health mode string to our internal RequestType enum. */
    private PlantApiCache.RequestType resolveRequestType(String healthMode) {
        if (healthMode == null)         return PlantApiCache.RequestType.IDENTIFY;
        return switch (healthMode) {
            case "only" -> PlantApiCache.RequestType.HEALTH_ONLY;
            case "all"  -> PlantApiCache.RequestType.FULL_DIAGNOSIS;
            case "auto" -> PlantApiCache.RequestType.AUTO_DIAGNOSIS;
            default     -> PlantApiCache.RequestType.IDENTIFY;
        };
    }

    // ── Public API ────────────────────────────────────────────────────────────

    /** Identification only — no health data. Cost: 1 credit. */
    @Override
    public PlantIdResponse identifyPlant(MultipartFile image, Double latitude,
                                         Double longitude, boolean similarImages) throws IOException {
        return callIdentificationEndpoint(image, null, latitude, longitude, similarImages);
    }

    /**
     * Health assessment only — no species identification context.
     * Cost: 1 credit. Lower accuracy because the species is unknown.
     */
    @Override
    public PlantIdResponse assessHealthOnly(MultipartFile image, Double latitude,
                                            Double longitude, boolean similarImages) throws IOException {
        return callIdentificationEndpoint(image, "only", latitude, longitude, similarImages);
    }

    /**
     * Identification + health together in one request.
     * The identified species is used to narrow down likely diseases.
     * Cost: 2 credits.
     */
    @Override
    public PlantIdResponse fullyDiagnoseCrop(MultipartFile image, Double latitude,
                                             Double longitude, boolean similarImages) throws IOException {
        return callIdentificationEndpoint(image, "all", latitude, longitude, similarImages);
    }

    /**
     * Identification + health only if something looks wrong.
     * Cost: 1 credit (healthy) or 2 credits (disease detected).
     */
    @Override
    public PlantIdResponse diagnoseCropAuto(MultipartFile image, Double latitude,
                                            Double longitude, boolean similarImages) throws IOException {
        return callIdentificationEndpoint(image, "auto", latitude, longitude, similarImages);
    }

    /** Returns credit usage information for the configured API key. */
    @Override
    public PlantIdUsageResponse getUsageInfo() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Api-Key", apiKey);

        HttpEntity<Void> request = new HttpEntity<>(headers);

        return restTemplate.exchange(
                BASE_URL + "usage_info",
                org.springframework.http.HttpMethod.GET,
                request,
                PlantIdUsageResponse.class
        ).getBody();
    }
}
