package mk.ukim.finki.uikt.biolense.backendbiolense.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mk.ukim.finki.uikt.biolense.backendbiolense.models.enumerations.CropStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "crops")
@NoArgsConstructor
@Data
@Getter
@Setter
public class Crop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "plant_type", nullable = false, length = 150)
    private String plantType;

    @Column(name = "field_name", nullable = false, length = 150)
    private String fieldName;

    @Column(name = "area_hectares", nullable = false, precision = 10, scale = 2)
    private BigDecimal areaHectares;

    @Column(name = "planted_at", nullable = false)
    private LocalDate plantedAt;

    @Column(name = "expected_harvest_at")
    private LocalDate expectedHarvestAt;

    @Column(name = "harvested_at")
    private LocalDate harvestedAt;

    @Column(name = "yield_kg_per_ha", precision = 10, scale = 2)
    private BigDecimal yieldKgPerHa;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private CropStatus status = CropStatus.ACTIVE;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();


    @OneToMany(mappedBy = "crop", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Diagnosis> diagnoses = new ArrayList<>();

    @OneToMany(mappedBy = "crop", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<IdentificationHistory> identificationHistories = new ArrayList<>();

//    @PrePersist
//    private void prePersist() {
//        if (createdAt == null) {
//            createdAt = OffsetDateTime.now();
//        }
//    }

    public void addDiagnosis(Diagnosis diagnosis) {
        diagnoses.add(diagnosis);
        diagnosis.setCrop(this);
    }

    public void removeDiagnosis(Diagnosis diagnosis) {
        diagnoses.remove(diagnosis);
        diagnosis.setCrop(null);
    }

    public void addIdentificationHistory(IdentificationHistory identificationHistory) {
        identificationHistories.add(identificationHistory);
        identificationHistory.setCrop(this);
    }

    public void removeIdentificationHistory(IdentificationHistory identificationHistory) {
        identificationHistories.remove(identificationHistory);
        identificationHistory.setCrop(null);
    }

    public Crop(User user, String plantType, String fieldName, BigDecimal areaHectares,
                LocalDate plantedAt, LocalDate expectedHarvestAt) {
        this.user = user;
        this.plantType = plantType;
        this.fieldName = fieldName;
        this.areaHectares = areaHectares;
        this.plantedAt = plantedAt;
        this.expectedHarvestAt = expectedHarvestAt;
    }

    public Crop(User user, String plantType, String fieldName, BigDecimal areaHectares,
                LocalDate plantedAt, LocalDate expectedHarvestAt, String notes) {
        this.user = user;
        this.plantType = plantType;
        this.fieldName = fieldName;
        this.areaHectares = areaHectares;
        this.plantedAt = plantedAt;
        this.expectedHarvestAt = expectedHarvestAt;
        this.notes = notes;
    }


}