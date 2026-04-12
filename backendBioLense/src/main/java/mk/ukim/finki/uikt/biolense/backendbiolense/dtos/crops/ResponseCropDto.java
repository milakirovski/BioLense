package mk.ukim.finki.uikt.biolense.backendbiolense.dtos.crops;

import mk.ukim.finki.uikt.biolense.backendbiolense.models.Crop;
import mk.ukim.finki.uikt.biolense.backendbiolense.models.enumerations.CropStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

public record ResponseCropDto(
        Long id,
        Long userId,
        String plantType,
        String fieldName,
        BigDecimal areaHectares,
        LocalDate plantedAt,
        LocalDate expectedHarvestAt,
        LocalDate harvestedAt,
        BigDecimal yieldKgPerHa,
        CropStatus status,
        String notes,
        OffsetDateTime createdAt,
        Long daysToHarvest,
        Long daysSincePlanting,      //  days elapsed since planting, elapsed from planting to today. Positive means the crop is in the ground, negative would mean a future planting date.
        Long daysUntilHarvest        //  days remaining until expected harvest, counts days remaining to expected harvest. Negative means the harvest date has already passed (useful for detecting overdue crops.
) {
    public static ResponseCropDto from(Crop crop) {
        LocalDate today = LocalDate.now();
        LocalDate plantedAt = crop.getPlantedAt();
        LocalDate expectedHarvestAt = crop.getExpectedHarvestAt();

        Long daysSincePlanting = plantedAt != null
                ? ChronoUnit.DAYS.between(plantedAt, today)
                : null;

        Long daysUntilHarvest = expectedHarvestAt != null
                ? ChronoUnit.DAYS.between(today, expectedHarvestAt)
                : null;

        Long daysToHarvest = (plantedAt != null && expectedHarvestAt != null)
                ? ChronoUnit.DAYS.between(plantedAt, expectedHarvestAt)
                : null;

        return new ResponseCropDto(
                crop.getId(),
                crop.getUser().getId(),
                crop.getPlantType(),
                crop.getFieldName(),
                crop.getAreaHectares(),
                plantedAt,
                expectedHarvestAt,
                crop.getHarvestedAt(),
                crop.getYieldKgPerHa(),
                crop.getStatus(),
                crop.getNotes(),
                crop.getCreatedAt(),
                daysToHarvest,
                daysSincePlanting,
                daysUntilHarvest
        );
    }

    public static List<ResponseCropDto> from(List<Crop> crops) {
        return crops.stream()
                .map(ResponseCropDto::from)
                .toList();
    }
}