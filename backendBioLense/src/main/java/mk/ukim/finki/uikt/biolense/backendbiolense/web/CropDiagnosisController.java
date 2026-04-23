package mk.ukim.finki.uikt.biolense.backendbiolense.web;

import lombok.RequiredArgsConstructor;
import mk.ukim.finki.uikt.biolense.backendbiolense.dtos.plantId.response.PlantIdResponse;
import mk.ukim.finki.uikt.biolense.backendbiolense.service.application.PlantIdClientService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/crops")
@RequiredArgsConstructor
public class CropDiagnosisController {

    private final PlantIdClientService plantIdClientService;

    /**
     * Primary endpoint — full crop diagnosis (ID + health together).
     * Cost: 2 credits
     */
    @PostMapping("/diagnose")
    public ResponseEntity<PlantIdResponse> diagnose(
            @RequestParam("image") MultipartFile image,
            @RequestParam(required = false) Double latitude,
            @RequestParam(required = false) Double longitude,
            @RequestParam(defaultValue = "true") boolean similarImages) throws IOException {
        return ResponseEntity.ok(plantIdClientService.fullyDiagnoseCrop(image, latitude, longitude, similarImages));
    }

    /**
     * Plant identification only — no health data.
     * Cost: 1 credit
     */
    @PostMapping("/identify")
    public ResponseEntity<PlantIdResponse> identify(
            @RequestParam("image") MultipartFile image,
            @RequestParam(required = false) Double latitude,
            @RequestParam(required = false) Double longitude,
            @RequestParam(defaultValue = "true") boolean similarImages) throws IOException {
        return ResponseEntity.ok(plantIdClientService.identifyPlant(image, latitude, longitude, similarImages));
    }

    /**
     * Cost-efficient diagnosis — health assessment runs only if disease is likely.
     * Cost: 1 credit (healthy) or 2 credits (disease detected)
     */
    @PostMapping("/diagnose-auto")
    public ResponseEntity<PlantIdResponse> diagnoseAuto(
            @RequestParam("image") MultipartFile image,
            @RequestParam(required = false) Double latitude,
            @RequestParam(required = false) Double longitude,
            @RequestParam(defaultValue = "true") boolean similarImages) throws IOException {
        return ResponseEntity.ok(plantIdClientService.diagnoseCropAuto(image, latitude, longitude, similarImages));
    }
}
