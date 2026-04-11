package mk.ukim.finki.uikt.biolense.backendbiolense.service.domain;

import mk.ukim.finki.uikt.biolense.backendbiolense.dtos.crops.CreateRequestCropDto;
import mk.ukim.finki.uikt.biolense.backendbiolense.dtos.crops.UpdateRequestCropDto;
import mk.ukim.finki.uikt.biolense.backendbiolense.models.Crop;
import mk.ukim.finki.uikt.biolense.backendbiolense.models.User;
import mk.ukim.finki.uikt.biolense.backendbiolense.models.enumerations.CropStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface CropService {

    //list all
    List<Crop> findAll();

    //find by id
    Crop findById(Long id);

    // Create
    Crop create(CreateRequestCropDto createRequestCropDto, User owner);

    // Update (area, dates, notes)
    Crop update(Long cropId, UpdateRequestCropDto updateRequestCropDto);

    // Delete
    void delete(Long cropId);

    // list filtering

    // filter by status
    List<Crop> findByStatus(String status);

    Crop logCropHarvest(Long cropId);
}