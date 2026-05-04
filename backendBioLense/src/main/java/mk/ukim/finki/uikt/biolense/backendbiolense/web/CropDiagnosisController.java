package mk.ukim.finki.uikt.biolense.backendbiolense.web;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import mk.ukim.finki.uikt.biolense.backendbiolense.dtos.plantId.response.DiagnosisResponseDto;
import mk.ukim.finki.uikt.biolense.backendbiolense.dtos.plantId.response.IdHistoryResponseDto;
import mk.ukim.finki.uikt.biolense.backendbiolense.dtos.plantId.response.PlantIdResponse;
import mk.ukim.finki.uikt.biolense.backendbiolense.dtos.plantId.response.PlantIdUsageResponse;
import mk.ukim.finki.uikt.biolense.backendbiolense.service.application.CropDiagnosisService;
import mk.ukim.finki.uikt.biolense.backendbiolense.service.application.PlantIdClientService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@Tag(name = "Crop Diagnosis", description = "The crop diagnosis API")
@RequestMapping("/api/crops")
@RequiredArgsConstructor
public class CropDiagnosisController {

    private final PlantIdClientService plantIdClientService;
    private final CropDiagnosisService cropDiagnosisService;
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
     * Diagnose an existing crop and persist the diagnosis in the database.
     */
    @PostMapping(value = "/diagnose/{cropId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Diagnose existing crop and save diagnosis")
    public ResponseEntity<PlantIdResponse> diagnoseAndSave(
            @Parameter(description = "Crop ID", required = true)
            @PathVariable Long cropId,
            @Parameter(description = "Plant image to diagnose", required = true)
            @RequestParam("image") MultipartFile image,
            @Parameter(description = "GPS latitude (optional)")
            @RequestParam(required = false) Double latitude,
            @Parameter(description = "GPS longitude (optional)")
            @RequestParam(required = false) Double longitude,
            @RequestParam(defaultValue = "true") boolean similarImages) throws IOException {
        return ResponseEntity.ok(
                cropDiagnosisService.diagnoseAndSave(
                        cropId,
                        image,
                        latitude,
                        longitude,
                        similarImages
                )
        );
    }


    @GetMapping("/diagnoses")
    @Operation(summary = "List all crop diagnoses")
    public ResponseEntity<List<DiagnosisResponseDto>> findAllDiagnoses() {
        return ResponseEntity.ok(cropDiagnosisService.findAll());
    }

    @GetMapping("/{cropId}/diagnoses")
    @Operation(summary = "List diagnoses for a specific crop")
    public ResponseEntity<List<DiagnosisResponseDto>> findAllDiagnosesByCropId(
            @Parameter(description = "Crop ID", required = true)
            @PathVariable Long cropId) {
        return ResponseEntity.ok(cropDiagnosisService.findAllByCropId(cropId));
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

    @GetMapping("/usage")
    @Operation(summary = "Check Plant.id API credit usage", description = "Returns credit limits, used credits, and remaining credits for the configured API key")
    public ResponseEntity<PlantIdUsageResponse> getUsageInfo() {
        return ResponseEntity.ok(plantIdClientService.getUsageInfo());
    }

    @GetMapping("/identification-history/{cropId}/")
    @Operation(summary = "List identification history for a specific crop")
    public ResponseEntity<List<IdHistoryResponseDto>> findIdentificationHistoryByCropId(
            @Parameter(description = "Crop ID", required = true)
            @PathVariable Long cropId) {
        return ResponseEntity.ok(cropDiagnosisService.findIdentificationHistoryByCropId(cropId));
    }
}
