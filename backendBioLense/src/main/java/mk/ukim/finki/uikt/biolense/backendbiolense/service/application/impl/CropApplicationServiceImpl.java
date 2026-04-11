package mk.ukim.finki.uikt.biolense.backendbiolense.service.application.impl;

import mk.ukim.finki.uikt.biolense.backendbiolense.dtos.crops.CreateRequestCropDto;
import mk.ukim.finki.uikt.biolense.backendbiolense.dtos.crops.ResponseCropDto;
import mk.ukim.finki.uikt.biolense.backendbiolense.dtos.crops.UpdateRequestCropDto;
import mk.ukim.finki.uikt.biolense.backendbiolense.models.User;
import mk.ukim.finki.uikt.biolense.backendbiolense.service.application.CropApplicationService;
import mk.ukim.finki.uikt.biolense.backendbiolense.service.domain.CropService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CropApplicationServiceImpl implements CropApplicationService {

    private final CropService cropService;

    public CropApplicationServiceImpl(CropService cropService) {
        this.cropService = cropService;
    }

    @Override
    public List<ResponseCropDto> findAll() {
        return ResponseCropDto.from(cropService.findAll());
    }

    @Override
    public ResponseCropDto findById(Long id) {
        return ResponseCropDto.from(cropService.findById(id));
    }

    @Override
    public ResponseCropDto create(CreateRequestCropDto createRequestCropDto, User owner) {
        return ResponseCropDto.from(cropService.create(createRequestCropDto, owner));
    }

    @Override
    public ResponseCropDto update(Long cropId, UpdateRequestCropDto updateRequestCropDto) {
        return ResponseCropDto.from(cropService.update(cropId, updateRequestCropDto));
    }

    @Override
    public void delete(Long id) {
        cropService.delete(id);
    }

    @Override
    public List<ResponseCropDto> findByStatus(String status) {
        return ResponseCropDto.from(cropService.findByStatus(status.toUpperCase()));
    }

    @Override
    public ResponseCropDto logCropHarvest(Long cropId) {
        return ResponseCropDto.from(cropService.logCropHarvest(cropId));
    }
}
