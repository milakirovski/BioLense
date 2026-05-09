package mk.ukim.finki.uikt.biolense.backendbiolense.dtos.plantId.response;

import mk.ukim.finki.uikt.biolense.backendbiolense.models.IdentificationHistory;

import java.time.OffsetDateTime;
import java.util.List;

public record IdHistoryResponseDto(
        Long id,
        Long cropId,
        String accessToken,
        String status,
        String identifiedPlantName,
        Double plantProbability,
        Boolean isPlant,
        Boolean isHealthy,
        Double healthProbability,
        String topDiseaseName,
        Double diseaseProbability,
        String mappedResponseJson,
        OffsetDateTime createdAt
) {

    public static IdHistoryResponseDto from(IdentificationHistory history) {
        return new IdHistoryResponseDto(
                history.getId(),
                history.getCrop().getId(),
                history.getAccessToken(),
                history.getStatus(),
                history.getIdentifiedPlantName(),
                history.getPlantProbability(),
                history.getIsPlant(),
                history.getIsHealthy(),
                history.getHealthProbability(),
                history.getTopDiseaseName(),
                history.getDiseaseProbability(),
                history.getMappedResponseJson(),
                history.getCreatedAt()
        );
    }

    public static List<IdHistoryResponseDto> from(List<IdentificationHistory> histories) {
        return histories.stream()
                .map(IdHistoryResponseDto::from)
                .toList();
    }


}