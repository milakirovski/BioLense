package mk.ukim.finki.uikt.biolense.backendbiolense.web;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import mk.ukim.finki.uikt.biolense.backendbiolense.dtos.crops.CreateRequestCropDto;
import mk.ukim.finki.uikt.biolense.backendbiolense.dtos.crops.ResponseCropDto;
import mk.ukim.finki.uikt.biolense.backendbiolense.dtos.crops.UpdateRequestCropDto;
import mk.ukim.finki.uikt.biolense.backendbiolense.exceptions.crop.CropIsAlreadyHarvestedException;
import mk.ukim.finki.uikt.biolense.backendbiolense.exceptions.crop.CropNotFoundException;
import mk.ukim.finki.uikt.biolense.backendbiolense.models.User;
import mk.ukim.finki.uikt.biolense.backendbiolense.models.enumerations.CropStatus;
import org.springframework.format.annotation.DateTimeFormat;
import mk.ukim.finki.uikt.biolense.backendbiolense.service.application.CropApplicationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@Tag(name = "Crops", description = "The crops API")
@RequestMapping("/api/crops")
public class CropController {

    private final CropApplicationService cropApplicationService;

    public CropController(CropApplicationService cropApplicationService) {
        this.cropApplicationService = cropApplicationService;
    }

    @GetMapping("/all")
    @Operation(summary = "Find all crops")
    public List<ResponseCropDto> findAll() {
        return cropApplicationService.findAll();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Find Crop by Id")
    public ResponseCropDto findById(@PathVariable Long id) {
        return cropApplicationService.findById(id);
    }

    @PostMapping("/create")
    @Operation(summary = "Create crop")
    public ResponseEntity<?> create(@RequestBody CreateRequestCropDto createRequestCropDto,
                                    @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.status(HttpStatus.OK).body(cropApplicationService.create(createRequestCropDto, currentUser));
    }


    @PutMapping("/update/{id}")
    @Operation(summary = "Update crop")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody UpdateRequestCropDto updateRequestCropDto) {
        try{
            return ResponseEntity.status(HttpStatus.OK).body(cropApplicationService.update(id, updateRequestCropDto));
        }catch (CropNotFoundException exception){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(exception.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    @Operation(summary = "Delete crop")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        try{
            cropApplicationService.delete(id);
            return ResponseEntity.status(HttpStatus.OK).body("Successfully deleted");
        }catch (CropNotFoundException exception){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(exception.getMessage());
        }
    }

    @GetMapping("/find-by-status")
    @Operation(summary = "Filter by crop status")
    public List<ResponseCropDto> findByStatus(@RequestParam CropStatus status){
        return cropApplicationService.findByStatus(status.name());
    }

    @GetMapping("/filter")
    @Operation(summary = "Filter crops", description = "Filter crops by any combination of plantType, fieldName, status, and date ranges. All parameters are optional.")
    public List<ResponseCropDto> filter(
            @RequestParam(required = false) String plantType,
            @RequestParam(required = false) String fieldName,
            @RequestParam(required = false) CropStatus status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate plantedAtFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate plantedAtTo,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate expectedHarvestAtFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate expectedHarvestAtTo,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate harvestedAtFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate harvestedAtTo
    ) {
        return cropApplicationService.filter(plantType, fieldName, status,
                plantedAtFrom, plantedAtTo,
                expectedHarvestAtFrom, expectedHarvestAtTo,
                harvestedAtFrom, harvestedAtTo);
    }

    @PutMapping("/log-harvest/{id}")
    @Operation(summary = "Log crop harvest", description = "Change the status of the crop from ACTIVE -> HARVESTED")
    public ResponseEntity<String> logCropHarvest(@PathVariable Long id){
        try{
            cropApplicationService.logCropHarvest(id);
            return ResponseEntity.status(HttpStatus.OK).body("Successfully logged harvest");
        }catch (CropIsAlreadyHarvestedException exception){
            return ResponseEntity.status(HttpStatus.ALREADY_REPORTED).body(exception.getMessage());
        }
    }
}
