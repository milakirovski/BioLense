package mk.ukim.finki.uikt.biolense.backendbiolense.service.application;

import mk.ukim.finki.uikt.biolense.backendbiolense.dtos.crops.CreateRequestCropDto;
import mk.ukim.finki.uikt.biolense.backendbiolense.dtos.crops.ResponseCropDto;
import mk.ukim.finki.uikt.biolense.backendbiolense.dtos.crops.UpdateRequestCropDto;
import mk.ukim.finki.uikt.biolense.backendbiolense.models.User;
import mk.ukim.finki.uikt.biolense.backendbiolense.models.enumerations.CropStatus;

import java.time.LocalDate;
import java.util.List;

public interface CropApplicationService {

    List<ResponseCropDto> findAll();
    ResponseCropDto findById(Long id);

    ResponseCropDto create(CreateRequestCropDto createRequestCropDto, User owner);

    ResponseCropDto update(Long cropId, UpdateRequestCropDto updateRequestCropDto);

    void delete(Long id);

    List<ResponseCropDto> findByStatus(String status);

    List<ResponseCropDto> filter(String plantType, String fieldName, CropStatus status,
                                 LocalDate plantedAtFrom, LocalDate plantedAtTo,
                                 LocalDate expectedHarvestAtFrom, LocalDate expectedHarvestAtTo,
                                 LocalDate harvestedAtFrom, LocalDate harvestedAtTo);

    ResponseCropDto logCropHarvest(Long cropId);
}
