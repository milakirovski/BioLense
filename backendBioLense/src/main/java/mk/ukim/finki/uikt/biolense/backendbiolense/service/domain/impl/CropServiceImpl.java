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
    public List<Crop> findAll() {
        return cropRepository.findAll();
    }

    @Override
    public Crop findById(Long id) throws CropNotFoundException{
        return cropRepository.findById(id).orElseThrow(CropNotFoundException::new);
    }

    @Override
    public Crop create(CreateRequestCropDto createRequestCropDto, User owner) {
        Crop newCrop = new Crop(owner,
                createRequestCropDto.plantType(), createRequestCropDto.fieldName(), createRequestCropDto.areaHectares(),
                createRequestCropDto.plantedAt(), createRequestCropDto.expectedHarvestAt(), createRequestCropDto.notes());

        return cropRepository.save(newCrop);
    }

    @Override
    public Crop update(Long cropId, UpdateRequestCropDto updateRequestCropDto) throws CropNotFoundException{
        Crop crop = findById(cropId);
        if(updateRequestCropDto.areaHectares() != null) crop.setAreaHectares(updateRequestCropDto.areaHectares());
        if(updateRequestCropDto.yieldKgPerHa() != null) crop.setYieldKgPerHa(updateRequestCropDto.yieldKgPerHa());
        if(updateRequestCropDto.expectedHarvestAt() != null) crop.setExpectedHarvestAt(updateRequestCropDto.expectedHarvestAt());
        if(updateRequestCropDto.notes() != null) crop.setNotes(updateRequestCropDto.notes());
        if(updateRequestCropDto.plantType() != null) crop.setPlantType(updateRequestCropDto.plantType());
        if(updateRequestCropDto.fieldName() != null) crop.setFieldName(updateRequestCropDto.fieldName());

        return cropRepository.save(crop);
    }

    @Override
    public void delete(Long cropId) throws CropNotFoundException{
        findById(cropId);
        cropRepository.deleteById(cropId);
    }

    @Override
    public List<Crop> findByStatus(String status) {
        return findAll().stream().filter(crop -> crop.getStatus().name().equals(status)).toList();
    }

    @Override
    public List<Crop> filter(String plantType, String fieldName, CropStatus status,
                             LocalDate plantedAtFrom, LocalDate plantedAtTo,
                             LocalDate expectedHarvestAtFrom, LocalDate expectedHarvestAtTo,
                             LocalDate harvestedAtFrom, LocalDate harvestedAtTo) {
        Specification<Crop> spec = Specification
                .where(CropSpecification.hasPlantType(plantType))
                .and(CropSpecification.hasFieldName(fieldName))
                .and(CropSpecification.hasStatus(status))
                .and(CropSpecification.plantedAtFrom(plantedAtFrom))
                .and(CropSpecification.plantedAtTo(plantedAtTo))
                .and(CropSpecification.expectedHarvestAtFrom(expectedHarvestAtFrom))
                .and(CropSpecification.expectedHarvestAtTo(expectedHarvestAtTo))
                .and(CropSpecification.harvestedAtFrom(harvestedAtFrom))
                .and(CropSpecification.harvestedAtTo(harvestedAtTo));
        return cropRepository.findAll(spec);
    }

    @Override
    public Crop logCropHarvest(Long cropId) {
        Crop crop = findById(cropId);
        if(crop.getStatus().equals(CropStatus.HARVESTED)) throw new CropIsAlreadyHarvestedException();
        crop.setStatus(CropStatus.HARVESTED);
        return cropRepository.save(crop);
    }
}