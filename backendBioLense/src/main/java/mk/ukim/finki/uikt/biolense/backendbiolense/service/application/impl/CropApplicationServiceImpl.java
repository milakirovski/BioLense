package mk.ukim.finki.uikt.biolense.backendbiolense.service.application.impl;

import mk.ukim.finki.uikt.biolense.backendbiolense.dtos.crops.CreateRequestCropDto;
import mk.ukim.finki.uikt.biolense.backendbiolense.dtos.crops.ResponseCropDto;
import mk.ukim.finki.uikt.biolense.backendbiolense.dtos.crops.UpdateRequestCropDto;
import mk.ukim.finki.uikt.biolense.backendbiolense.models.User;
import mk.ukim.finki.uikt.biolense.backendbiolense.models.enumerations.CropStatus;
import mk.ukim.finki.uikt.biolense.backendbiolense.service.application.CropApplicationService;
import mk.ukim.finki.uikt.biolense.backendbiolense.service.domain.CropService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class CropApplicationServiceImpl implements CropApplicationService {

    private final CropService cropService;

    public CropApplicationServiceImpl(CropService cropService) {
        this.cropService = cropService;
    }

    @Override
    public List<ResponseCropDto> findAllByUser(User user) {
        return ResponseCropDto.from(cropService.findAllByUser(user));
    }

    @Override
    public ResponseCropDto findById(Long id, User user) {
        return ResponseCropDto.from(cropService.findById(id, user));
    }

    @Override
    public ResponseCropDto create(CreateRequestCropDto createRequestCropDto, User owner) {
        return ResponseCropDto.from(cropService.create(createRequestCropDto, owner));
    }

    @Override
    public ResponseCropDto update(Long cropId, UpdateRequestCropDto updateRequestCropDto, User user) {
        return ResponseCropDto.from(cropService.update(cropId, updateRequestCropDto, user));
    }

    @Override
    public void delete(Long id, User user) {
        cropService.delete(id, user);
    }

    @Override
    public List<ResponseCropDto> findByStatus(String status, User user) {
        return ResponseCropDto.from(cropService.findByStatus(status, user));
    }

    @Override
    public List<ResponseCropDto> filter(String plantType, String fieldName, CropStatus status,
                                        LocalDate plantedAtFrom, LocalDate plantedAtTo,
                                        LocalDate expectedHarvestAtFrom, LocalDate expectedHarvestAtTo,
                                        LocalDate harvestedAtFrom, LocalDate harvestedAtTo, User user) {
        return ResponseCropDto.from(cropService.filter(plantType, fieldName, status,
                plantedAtFrom, plantedAtTo,
                expectedHarvestAtFrom, expectedHarvestAtTo,
                harvestedAtFrom, harvestedAtTo, user));
    }

    @Override
    public ResponseCropDto logCropHarvest(Long cropId, User user) {
        return ResponseCropDto.from(cropService.logCropHarvest(cropId, user));
    }
}
