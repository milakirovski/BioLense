package mk.ukim.finki.uikt.biolense.backendbiolense.service.application;

import mk.ukim.finki.uikt.biolense.backendbiolense.dtos.crops.PlantIdResponseDto;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface PlantIdClientService {
    PlantIdResponseDto identifyPlant(MultipartFile image) throws IOException;

    PlantIdResponseDto assessHealth(MultipartFile image) throws IOException;
}
