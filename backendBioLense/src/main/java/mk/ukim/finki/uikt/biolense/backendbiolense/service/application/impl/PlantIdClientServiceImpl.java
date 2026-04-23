package mk.ukim.finki.uikt.biolense.backendbiolense.service.application.impl;

import lombok.extern.slf4j.Slf4j;
import mk.ukim.finki.uikt.biolense.backendbiolense.dtos.plantId.request.PlantIdApiRequest;
import mk.ukim.finki.uikt.biolense.backendbiolense.dtos.plantId.response.PlantIdResponse;
import mk.ukim.finki.uikt.biolense.backendbiolense.service.application.PlantIdClientService;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Value;

import java.io.IOException;
import java.util.Base64;
import java.util.Collections;

@Slf4j
@Service
public class PlantIdClientServiceImpl implements PlantIdClientService {

    @Value("${plant.id.api.key}")
    private String apiKey;

    private static final String BASE_URL = "https://plant.id/api/v3/"; //"https://api.plant.id/v3";

    private final RestTemplate restTemplate = new RestTemplate();


    /**
     * Single shared method — health mode drives the behavior
     * identification and health assessment share the base url: https://plant.id/api/v3/identification
     *
     * https://plant.id/api/v3/identification?health=all => ID + HEALTH_AS +2 credits
     * https://plant.id/api/v3/identification?health=auto => ID + HEALTH_AS +1-2 credits
     * https://plant.id/api/v3/identification?health=only => HEALTH_AS only +1 credit
     *
     * health = null  → identification only
     * health = "only"→ disease only, no ID context
     * health = "all" → ID + disease together (best for crop diagnosis)
     * health = "auto"→ ID + disease only if something looks wrong
     * @param image
     * @param healthMode
     * @return
     * @throws IOException
     */
    private PlantIdResponse callIdentificationEndpoint(
            MultipartFile image, String healthMode,
            Double latitude, Double longitude, boolean similarImages) throws IOException {

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Api-Key", apiKey);

        String base64Image = Base64.getEncoder().encodeToString(image.getBytes());

        PlantIdApiRequest requestBody = PlantIdApiRequest.builder()
                .images(Collections.singletonList("data:image/jpeg;base64," + base64Image))
                .latitude(latitude)
                .longitude(longitude)
                .build();

        HttpEntity<PlantIdApiRequest> request = new HttpEntity<>(requestBody, headers);

        StringBuilder url = new StringBuilder(BASE_URL).append("identification?similar_images=").append(similarImages);
        if (healthMode != null) {
            url.append("&health=").append(healthMode);
        }

        log.info("Calling Plant.id [health={}] → {}", healthMode, url);

        return restTemplate.postForObject(url.toString(), request, PlantIdResponse.class);
    }


    /**
     * Identification only — no health data.
     * Cost: 1 credit
     */
    @Override
    public PlantIdResponse identifyPlant(MultipartFile image, Double latitude, Double longitude, boolean similarImages) throws IOException {
        return callIdentificationEndpoint(image, null, latitude, longitude, similarImages);
    }


    /**
     * Health assessment only — no species identification context.
     * Cost: 1 credit
     * DISADVANTAGE: Lower accuracy because the species is unknown.
     */
    @Override
    public PlantIdResponse assessHealthOnly(MultipartFile image, Double latitude, Double longitude, boolean similarImages) throws IOException {
        return callIdentificationEndpoint(image, "only", latitude, longitude, similarImages);
    }

    /**
     * Identification + health together in one request.
     * The identified species is used to narrow down likely diseases,
     * which significantly improves diagnosis accuracy for crops.
     * Cost: 2 credits
     */
    @Override
    public PlantIdResponse fullyDiagnoseCrop(MultipartFile image, Double latitude, Double longitude, boolean similarImages) throws IOException {
        return callIdentificationEndpoint(image, "all", latitude, longitude, similarImages);
    }

    /**
     * Identification + health assessment only if something looks wrong.
     * If the model detects signs of disease above a threshold, full health response is returned.
     * Cost: 1 credit (healthy plant) or 2 credits (disease detected)
     * USE CASE: When you want to save credits but still catch most disease cases.
     */
    @Override
    public PlantIdResponse diagnoseCropAuto(MultipartFile image, Double latitude, Double longitude, boolean similarImages) throws IOException {
        return callIdentificationEndpoint(image, "auto", latitude, longitude, similarImages);
    }

}
