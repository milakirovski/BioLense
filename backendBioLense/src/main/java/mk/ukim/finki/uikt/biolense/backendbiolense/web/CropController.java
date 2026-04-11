package mk.ukim.finki.uikt.biolense.backendbiolense.web;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import mk.ukim.finki.uikt.biolense.backendbiolense.dtos.crops.CreateRequestCropDto;
import mk.ukim.finki.uikt.biolense.backendbiolense.dtos.crops.ResponseCropDto;
import mk.ukim.finki.uikt.biolense.backendbiolense.dtos.crops.UpdateRequestCropDto;
import mk.ukim.finki.uikt.biolense.backendbiolense.exceptions.crop.CropIsAlreadyHarvestedException;
import mk.ukim.finki.uikt.biolense.backendbiolense.exceptions.crop.CropNotFoundException;
import mk.ukim.finki.uikt.biolense.backendbiolense.models.User;
import mk.ukim.finki.uikt.biolense.backendbiolense.service.application.CropApplicationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

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
    public List<ResponseCropDto> findByStatus(@RequestParam String status){
        return cropApplicationService.findByStatus(status);
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
