package mk.ukim.finki.uikt.biolense.backendbiolense.dtos.plantId.response;

import mk.ukim.finki.uikt.biolense.backendbiolense.models.Diagnosis;

import java.time.OffsetDateTime;
import java.util.List;

public record DiagnosisResponseDto(
        Long id,
        Long cropId,
        String plantName,
        String diseaseName,
        Double confidence,
        Boolean isHealthy,
        String treatment,
        OffsetDateTime diagnosedAt
) {

    public static DiagnosisResponseDto from(Diagnosis diagnosis) {
        return new DiagnosisResponseDto(
                diagnosis.getId(),
                diagnosis.getCrop().getId(),
                diagnosis.getPlantName(),
                diagnosis.getDiseaseName(),
                diagnosis.getConfidence(),
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