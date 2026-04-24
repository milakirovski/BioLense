package mk.ukim.finki.uikt.biolense.backendbiolense.web;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import mk.ukim.finki.uikt.biolense.backendbiolense.dtos.plantId.response.PlantIdResponse;
import mk.ukim.finki.uikt.biolense.backendbiolense.service.application.PlantIdClientService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@Tag(name = "Crop Diagnosis", description = "The crop diagnosis API")
@RequestMapping("/api/crops")
@RequiredArgsConstructor
public class CropDiagnosisController {

    private final PlantIdClientService plantIdClientService;

    /**
     * Primary endpoint — full crop diagnosis (ID + health together).
     * Cost: 2 credits
     */
    @PostMapping(value = "/diagnose", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Diagnose crop (Identification + health assessment) by uploading an image")
    public ResponseEntity<PlantIdResponse> diagnose(
            @Parameter(description = "Plant image to diagnose", required = true)
            @RequestParam("image") MultipartFile image,
            @Parameter(description = "GPS latitude (optional)")
            @RequestParam(required = false) Double latitude,
            @Parameter(description = "GPS longitude (optional)")
            @RequestParam(required = false) Double longitude,
            @RequestParam(defaultValue = "true") boolean similarImages) throws IOException {
        return ResponseEntity.ok(plantIdClientService.fullyDiagnoseCrop(image, latitude, longitude, similarImages));
    }

    /**
     * Plant identification only — no health data.
     * Cost: 1 credit
     */
    @PostMapping(value = "/identify", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Identify crop (no health assessment) by uploading an image")
    public ResponseEntity<PlantIdResponse> identify(
            @Parameter(description = "Plant image to identify", required = true)
            @RequestParam("image") MultipartFile image,
            @Parameter(description = "GPS latitude (optional)")
            @RequestParam(required = false) Double latitude,
            @Parameter(description = "GPS longitude (optional)")
            @RequestParam(required = false) Double longitude,
            @RequestParam(defaultValue = "true") boolean similarImages) throws IOException {
        return ResponseEntity.ok(plantIdClientService.identifyPlant(image, latitude, longitude, similarImages));
    }

    /**
     * Cost-efficient diagnosis — health assessment runs only if disease is likely.
     * Cost: 1 credit (healthy) or 2 credits (disease detected)
     */
    @PostMapping(value = "/diagnose-auto", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Auto diagnose crop (health assessment runs only if disease is likely) by uploading an image")
    public ResponseEntity<PlantIdResponse> diagnoseAuto(
            @Parameter(description = "Plant image to diagnose", required = true)
            @RequestParam("image") MultipartFile image,
            @Parameter(description = "GPS latitude (optional)")
            @RequestParam(required = false) Double latitude,
            @Parameter(description = "GPS longitude (optional)")
            @RequestParam(required = false) Double longitude,
            @RequestParam(defaultValue = "true") boolean similarImages) throws IOException {
        return ResponseEntity.ok(plantIdClientService.diagnoseCropAuto(image, latitude, longitude, similarImages));
    }
}
