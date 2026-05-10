package mk.ukim.finki.uikt.biolense.backendbiolense.service.domain.impl;

import mk.ukim.finki.uikt.biolense.backendbiolense.dtos.crops.CreateRequestCropDto;
import mk.ukim.finki.uikt.biolense.backendbiolense.dtos.crops.UpdateRequestCropDto;
import mk.ukim.finki.uikt.biolense.backendbiolense.exceptions.crop.CropIsAlreadyHarvestedException;
import mk.ukim.finki.uikt.biolense.backendbiolense.exceptions.crop.CropNotFoundException;
import mk.ukim.finki.uikt.biolense.backendbiolense.models.Crop;
import mk.ukim.finki.uikt.biolense.backendbiolense.models.User;
import mk.ukim.finki.uikt.biolense.backendbiolense.models.enumerations.CropStatus;
import mk.ukim.finki.uikt.biolense.backendbiolense.helpers.CropSpecification;
import mk.ukim.finki.uikt.biolense.backendbiolense.repositories.CropRepository;
import mk.ukim.finki.uikt.biolense.backendbiolense.service.domain.CropService;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class CropServiceImpl implements CropService {

    private final CropRepository cropRepository;

    public CropServiceImpl(CropRepository cropRepository) {
        this.cropRepository = cropRepository;
    }

    @Override
    public List<Crop> findAllByUser(User user) {
        return cropRepository.findAllByUserId(user.getId());
    }

    @Override
    public Crop findById(Long id, User user) throws CropNotFoundException{
        return cropRepository.findByIdAndUserId(id, user.getId()).orElseThrow(CropNotFoundException::new);
    }

    @Override
    public Crop create(CreateRequestCropDto createRequestCropDto, User owner) {
        Crop newCrop = new Crop(owner,
                createRequestCropDto.plantType(), createRequestCropDto.fieldName(), createRequestCropDto.areaHectares(),
                createRequestCropDto.plantedAt(), createRequestCropDto.expectedHarvestAt(), createRequestCropDto.notes());

        return cropRepository.save(newCrop);
    }

    @Override
    public Crop update(Long cropId, UpdateRequestCropDto updateRequestCropDto, User user) throws CropNotFoundException{
        Crop crop = findById(cropId, user);
        if(updateRequestCropDto.areaHectares() != null) crop.setAreaHectares(updateRequestCropDto.areaHectares());
        if(updateRequestCropDto.yieldKgPerHa() != null) crop.setYieldKgPerHa(updateRequestCropDto.yieldKgPerHa());
        if(updateRequestCropDto.expectedHarvestAt() != null) crop.setExpectedHarvestAt(updateRequestCropDto.expectedHarvestAt());
        if(updateRequestCropDto.notes() != null) crop.setNotes(updateRequestCropDto.notes());
        if(updateRequestCropDto.plantType() != null) crop.setPlantType(updateRequestCropDto.plantType());
        if(updateRequestCropDto.fieldName() != null) crop.setFieldName(updateRequestCropDto.fieldName());

        return cropRepository.save(crop);
    }

    @Override
    public void delete(Long cropId, User user) throws CropNotFoundException{
        findById(cropId, user);
        cropRepository.deleteById(cropId);
    }

    @Override
    public List<Crop> findByStatus(String status, User user) {
        return cropRepository.findAllByUserIdAndStatus(user.getId(), CropStatus.valueOf(status));
    }

    @Override
    public List<Crop> filter(String plantType, String fieldName, CropStatus status,
                             LocalDate plantedAtFrom, LocalDate plantedAtTo,
                             LocalDate expectedHarvestAtFrom, LocalDate expectedHarvestAtTo,
                             LocalDate harvestedAtFrom, LocalDate harvestedAtTo, User user) {
        Specification<Crop> spec = Specification
                .where(CropSpecification.hasPlantType(plantType))
                .or(CropSpecification.hasFieldName(fieldName))
                .or(CropSpecification.hasStatus(status))
                .or(CropSpecification.plantedAtFrom(plantedAtFrom))
                .or(CropSpecification.plantedAtTo(plantedAtTo))
                .or(CropSpecification.expectedHarvestAtFrom(expectedHarvestAtFrom))
                .or(CropSpecification.expectedHarvestAtTo(expectedHarvestAtTo))
                .or(CropSpecification.harvestedAtFrom(harvestedAtFrom))
                .or(CropSpecification.harvestedAtTo(harvestedAtTo));
        return cropRepository.findAll(spec);
    }

    @Override
    public Crop logCropHarvest(Long cropId, User user) {
        Crop crop = findById(cropId, user);
        if(crop.getStatus().equals(CropStatus.HARVESTED)) throw new CropIsAlreadyHarvestedException();
        crop.setStatus(CropStatus.HARVESTED);
        return cropRepository.save(crop);
    }
}
