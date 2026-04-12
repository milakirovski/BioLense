package mk.ukim.finki.uikt.biolense.backendbiolense.dtos.crops;

import java.math.BigDecimal;
import java.time.LocalDate;

public record CreateRequestCropDto(
        String plantType,
        String fieldName,
        BigDecimal areaHectares,
        LocalDate plantedAt,
        LocalDate expectedHarvestAt,
        String notes
) {
}
