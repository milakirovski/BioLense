package mk.ukim.finki.uikt.biolense.backendbiolense.web;

import mk.ukim.finki.uikt.biolense.backendbiolense.dtos.crops.PlantIdResponseDto;
import mk.ukim.finki.uikt.biolense.backendbiolense.service.application.PlantIdClientService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/plant-id")
public class PlantIDController {

    private final PlantIdClientService plantIdClientService;

    public PlantIDController(PlantIdClientService plantIdClientService) {
        this.plantIdClientService = plantIdClientService;
    }

    @RequestMapping("/identify")
    public PlantIdResponseDto identifyPlant(MultipartFile image) throws IOException {
        return plantIdClientService.identifyPlant(image);
    }

    @RequestMapping("/assess-health")
    public PlantIdResponseDto assessHealth(MultipartFile image) throws IOException {
        return plantIdClientService.assessHealth(image);
    }
}
