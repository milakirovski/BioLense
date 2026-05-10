package mk.ukim.finki.uikt.biolense.backendbiolense.service.domain;

import mk.ukim.finki.uikt.biolense.backendbiolense.dtos.crops.CreateRequestCropDto;
import mk.ukim.finki.uikt.biolense.backendbiolense.dtos.crops.UpdateRequestCropDto;
import mk.ukim.finki.uikt.biolense.backendbiolense.models.Crop;
import mk.ukim.finki.uikt.biolense.backendbiolense.models.User;
import mk.ukim.finki.uikt.biolense.backendbiolense.models.enumerations.CropStatus;

import java.time.LocalDate;
import java.util.List;

public interface CropService {

    //list all
    List<Crop> findAllByUser(User user);

    //find by id
    Crop findById(Long id, User user);

    // Create
    Crop create(CreateRequestCropDto createRequestCropDto, User owner);

    // Update (area, dates, notes)
    Crop update(Long cropId, UpdateRequestCropDto updateRequestCropDto, User user);

    // Delete
    void delete(Long cropId, User user);

    // list filtering

    // filter by status
    List<Crop> findByStatus(String status, User user);

    List<Crop> filter(String plantType, String fieldName, CropStatus status,
                      LocalDate plantedAtFrom, LocalDate plantedAtTo,
                      LocalDate expectedHarvestAtFrom, LocalDate expectedHarvestAtTo,
                      LocalDate harvestedAtFrom, LocalDate harvestedAtTo, User user);

    Crop logCropHarvest(Long cropId, User user);
}