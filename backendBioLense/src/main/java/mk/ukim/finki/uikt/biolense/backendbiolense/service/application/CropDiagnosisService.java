package mk.ukim.finki.uikt.biolense.backendbiolense.service.application;

import mk.ukim.finki.uikt.biolense.backendbiolense.dtos.plantId.response.DiagnosisResponseDto;
import mk.ukim.finki.uikt.biolense.backendbiolense.dtos.plantId.response.IdHistoryResponseDto;
import mk.ukim.finki.uikt.biolense.backendbiolense.dtos.plantId.response.PlantIdResponse;
import mk.ukim.finki.uikt.biolense.backendbiolense.models.User;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface CropDiagnosisService {
    PlantIdResponse diagnoseAndSave(
            Long cropId,
            MultipartFile image,
            Double latitude,
            Double longitude,
            boolean similarImages
    ) throws IOException;
    List<DiagnosisResponseDto> findAllByUserId(User user);

    List<DiagnosisResponseDto> findAllByCropId(Long cropId);
    List<IdHistoryResponseDto> findIdentificationHistoryByCropId(Long cropId);
}
