package mk.ukim.finki.uikt.biolense.backendbiolense.service.application.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mk.ukim.finki.uikt.biolense.backendbiolense.dtos.plantId.response.PlantIdResponse;
import mk.ukim.finki.uikt.biolense.backendbiolense.helpers.ImageHashUtil;
import mk.ukim.finki.uikt.biolense.backendbiolense.models.PlantApiCache;
import mk.ukim.finki.uikt.biolense.backendbiolense.repositories.PlantApiCacheRepository;
import mk.ukim.finki.uikt.biolense.backendbiolense.service.application.PlantIdCacheService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class PlantIdCacheServiceImpl implements PlantIdCacheService {

    private final PlantApiCacheRepository cacheRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    @Transactional(readOnly = true)
    public Optional<PlantIdResponse> lookup(PlantApiCache.RequestType requestType,
                                            String imageHash,
                                            Double latitude,
                                            Double longitude) {
        String cacheKey = ImageHashUtil.buildCacheKey(requestType.name(), imageHash, latitude, longitude);

        return cacheRepository.findByCacheKey(cacheKey)
                .flatMap(entry -> deserialize(entry.getResponsePayload()));
    }

    @Override
    @Transactional
    public void store(PlantApiCache.RequestType requestType,
                      String imageHash,
                      Double latitude,
                      Double longitude,
                      PlantIdResponse response) {
        String cacheKey = ImageHashUtil.buildCacheKey(requestType.name(), imageHash, latitude, longitude);

        // Guard: skip if an entry already exists (race condition safety)
        if (cacheRepository.findByCacheKey(cacheKey).isPresent()) {
            log.debug("Cache entry already exists for key={}, skipping store", cacheKey);
            return;
        }

        String json = serialize(response);
        if (json == null) {
            log.warn("Failed to serialise Plant.id response — cache entry will not be saved");
            return;
        }

        PlantApiCache entry = new PlantApiCache(cacheKey, imageHash, latitude, longitude, requestType, json);
        cacheRepository.save(entry);
        log.info("Cached Plant.id response [type={}, imageHash={}, lat={}, lon={}]",
                requestType, imageHash, latitude, longitude);
    }

    // ── private helpers ──────────────────────────────────────────────────────

    private String serialize(PlantIdResponse response) {
        try {
            return objectMapper.writeValueAsString(response);
        } catch (JsonProcessingException e) {
            log.error("Could not serialise PlantIdResponse to JSON", e);
            return null;
        }
    }

    private Optional<PlantIdResponse> deserialize(String json) {
        try {
            return Optional.of(objectMapper.readValue(json, PlantIdResponse.class));
        } catch (JsonProcessingException e) {
            log.error("Could not deserialise cached PlantIdResponse JSON", e);
            return Optional.empty();
        }
    }
}
