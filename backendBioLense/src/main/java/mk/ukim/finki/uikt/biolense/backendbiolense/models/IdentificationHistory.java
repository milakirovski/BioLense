package mk.ukim.finki.uikt.biolense.backendbiolense.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

@Entity
@Table(name = "identification_histories")
@NoArgsConstructor
@Data
public class IdentificationHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "crop_id", nullable = false)
    private Crop crop;

    @Column(name = "access_token")
    private String accessToken;

    @Column(name = "status", length = 100)
    private String status;

    @Column(name = "identified_plant_name", length = 200)
    private String identifiedPlantName;

    @Column(name = "plant_probability")
    private Double plantProbability;

    @Column(name = "is_plant")
    private Boolean isPlant;

    @Column(name = "is_healthy")
    private Boolean isHealthy;

    @Column(name = "health_probability")
    private Double healthProbability;

    @Column(name = "top_disease_name", length = 200)
    private String topDiseaseName;

    @Column(name = "disease_probability")
    private Double diseaseProbability;

    @Lob
    @Column(name = "mapped_response_json", columnDefinition = "TEXT", nullable = false)
    private String mappedResponseJson;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();

    public IdentificationHistory(
            Crop crop,
            String accessToken,
            String status,
            String identifiedPlantName,
            Double plantProbability,
            Boolean isPlant,
            Boolean isHealthy,
            Double healthProbability,
            String topDiseaseName,
            Double diseaseProbability,
            String mappedResponseJson
    ) {
        this.crop = crop;
        this.accessToken = accessToken;
        this.status = status;
        this.identifiedPlantName = identifiedPlantName;
        this.plantProbability = plantProbability;
        this.isPlant = isPlant;
        this.isHealthy = isHealthy;
        this.healthProbability = healthProbability;
        this.topDiseaseName = topDiseaseName;
        this.diseaseProbability = diseaseProbability;
        this.mappedResponseJson = mappedResponseJson;
    }
}