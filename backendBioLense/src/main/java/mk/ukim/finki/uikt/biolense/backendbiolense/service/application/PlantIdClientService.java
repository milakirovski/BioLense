package mk.ukim.finki.uikt.biolense.backendbiolense.service.application;

import mk.ukim.finki.uikt.biolense.backendbiolense.dtos.plantId.response.PlantIdResponse;
import mk.ukim.finki.uikt.biolense.backendbiolense.dtos.plantId.response.PlantIdUsageResponse;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface PlantIdClientService {
    PlantIdResponse identifyPlant(MultipartFile image, Double latitude, Double longitude, boolean similarImages) throws IOException;

    PlantIdResponse assessHealthOnly(MultipartFile image, Double latitude, Double longitude, boolean similarImages) throws IOException;

    PlantIdResponse fullyDiagnoseCrop(MultipartFile image, Double latitude, Double longitude, boolean similarImages) throws IOException;

    PlantIdResponse diagnoseCropAuto(MultipartFile image, Double latitude, Double longitude, boolean similarImages) throws IOException;

    PlantIdUsageResponse getUsageInfo();
}
