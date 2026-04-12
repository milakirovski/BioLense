package mk.ukim.finki.uikt.biolense.backendbiolense.dtos.crops;

import java.math.BigDecimal;
import java.time.LocalDate;

public record UpdateRequestCropDto(
        String plantType,
        String fieldName,
        BigDecimal areaHectares,
        LocalDate expectedHarvestAt,
        BigDecimal yieldKgPerHa,
        String notes
){
}
