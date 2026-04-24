package mk.ukim.finki.uikt.biolense.backendbiolense.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

@Entity
@Table(
        name = "plant_api_cache",
        indexes = @Index(name = "idx_plant_api_cache_key", columnList = "cache_key")
)
@Data
@NoArgsConstructor
public class PlantApiCache {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Unique lookup key: SHA-256 of (requestType|imageHash|latitude|longitude).
     * Allows O(1) cache hit detection via a single indexed column.
     */
    @Column(name = "cache_key", nullable = false, unique = true, length = 64)
    private String cacheKey;

    /** SHA-256 hex of the raw image bytes — stored for auditing/debugging. */
    @Column(name = "image_hash", nullable = false, length = 64)
    private String imageHash;

    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "longitude")
    private Double longitude;

    @Enumerated(EnumType.STRING)
    @Column(name = "request_type", nullable = false, length = 20)
    private RequestType requestType;

    /** Full Plant.id API response serialised as JSON. */
    @Column(name = "response_payload", nullable = false, columnDefinition = "TEXT")
    private String responsePayload;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();

    public PlantApiCache(String cacheKey, String imageHash, Double latitude,
                         Double longitude, RequestType requestType, String responsePayload) {
        this.cacheKey = cacheKey;
        this.imageHash = imageHash;
        this.latitude = latitude;
        this.longitude = longitude;
        this.requestType = requestType;
        this.responsePayload = responsePayload;
    }

    public enum RequestType {
        IDENTIFY,
        HEALTH_ONLY,
        FULL_DIAGNOSIS,
        AUTO_DIAGNOSIS
    }
}
