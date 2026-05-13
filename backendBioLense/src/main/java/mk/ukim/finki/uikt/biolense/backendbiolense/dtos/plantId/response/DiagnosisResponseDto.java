package mk.ukim.finki.uikt.biolense.backendbiolense.dtos.plantId.response;

import mk.ukim.finki.uikt.biolense.backendbiolense.models.Diagnosis;

import java.time.OffsetDateTime;
import java.util.List;

public record DiagnosisResponseDto(
        Long id,
        Long cropId,
        String plantName,
        String fieldName,
        String diseaseName,
        Double confidence,
        Boolean isHealthy,
        String treatment,
        OffsetDateTime diagnosedAt
) {

    public static DiagnosisResponseDto from(Diagnosis diagnosis) {
        Double rawConf = diagnosis.getConfidence();
        return new DiagnosisResponseDto(
                diagnosis.getId(),
                diagnosis.getCrop().getId(),
                diagnosis.getPlantName(),
                diagnosis.getCrop().getFieldName(),
                diagnosis.getDiseaseName(),
                rawConf != null ? Math.round(rawConf * 100.0) / 100.0 * 100 : null,
                diagnosis.getIsHealthy(),
                diagnosis.getTreatment(),
                diagnosis.getDiagnosedAt()
        );
    }

    public static List<DiagnosisResponseDto> from(List<Diagnosis> diagnoses) {
        return diagnoses.stream()
                .map(DiagnosisResponseDto::from)
                .toList();
    }
}