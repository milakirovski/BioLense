package mk.ukim.finki.uikt.biolense.backendbiolense.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

@Entity
@Table(name = "diagnoses")
@NoArgsConstructor
@Data
public class Diagnosis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "crop_id", nullable = false)
    private Crop crop;

    @Column(name = "plant_name", nullable = false, length = 200)
    private String plantName;

    @Column(name = "disease_name", length = 200)
    private String diseaseName;

    @Column(name = "confidence")
    private Double confidence;

    @Column(name = "is_healthy")
    private Boolean isHealthy;

    @Column(name = "treatment", columnDefinition = "TEXT")
    private String treatment;

    @Column(name = "diagnosed_at", nullable = false, updatable = false)
    private OffsetDateTime diagnosedAt = OffsetDateTime.now();

    public Diagnosis(Crop crop, String plantName, String diseaseName,
                     Double confidence, Boolean isHealthy, String treatment) {
        this.crop = crop;
        this.plantName = plantName;
        this.diseaseName = diseaseName;
        this.confidence = confidence;
        this.isHealthy = isHealthy;
        this.treatment = treatment;
    }
}
