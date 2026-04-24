package mk.ukim.finki.uikt.biolense.backendbiolense.service.application;

import mk.ukim.finki.uikt.biolense.backendbiolense.dtos.plantId.response.PlantIdResponse;
import mk.ukim.finki.uikt.biolense.backendbiolense.models.PlantApiCache;

import java.util.Optional;

public interface PlantIdCacheService {

    /**
     * Looks up a previously cached Plant.id API response.
     *
     * @param requestType the type of API call (IDENTIFY, HEALTH_ONLY, etc.)
     * @param imageHash   SHA-256 hex of the uploaded image bytes
     * @param latitude    optional GPS latitude
     * @param longitude   optional GPS longitude
     * @return the cached {@link PlantIdResponse}, or empty if no cache entry exists
     */
    Optional<PlantIdResponse> lookup(PlantApiCache.RequestType requestType,
                                     String imageHash,
                                     Double latitude,
                                     Double longitude);

    /**
     * Persists a Plant.id API response so that identical future requests
     * can be served from the database instead of the external API.
     *
     * @param requestType the type of API call
     * @param imageHash   SHA-256 hex of the uploaded image bytes
     * @param latitude    optional GPS latitude
     * @param longitude   optional GPS longitude
     * @param response    the response to cache
     */
    void store(PlantApiCache.RequestType requestType,
               String imageHash,
               Double latitude,
               Double longitude,
               PlantIdResponse response);
}
