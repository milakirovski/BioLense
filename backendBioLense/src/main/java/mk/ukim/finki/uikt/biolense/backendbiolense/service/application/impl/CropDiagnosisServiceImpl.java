package mk.ukim.finki.uikt.biolense.backendbiolense.service.application.impl;

import lombok.RequiredArgsConstructor;
import mk.ukim.finki.uikt.biolense.backendbiolense.dtos.plantId.response.DiagnosisResponseDto;
import mk.ukim.finki.uikt.biolense.backendbiolense.dtos.plantId.response.PlantIdResponse;
import mk.ukim.finki.uikt.biolense.backendbiolense.models.Crop;
import mk.ukim.finki.uikt.biolense.backendbiolense.models.Diagnosis;
import mk.ukim.finki.uikt.biolense.backendbiolense.repositories.CropRepository;
import mk.ukim.finki.uikt.biolense.backendbiolense.repositories.DiagnosisRepository;
import mk.ukim.finki.uikt.biolense.backendbiolense.service.application.CropDiagnosisService;
import mk.ukim.finki.uikt.biolense.backendbiolense.service.application.PlantIdClientService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class CropDiagnosisServiceImpl implements CropDiagnosisService {

    private final CropRepository cropRepository;
    private final DiagnosisRepository diagnosisRepository;
    private final PlantIdClientService plantIdClientService;

    @Override
    public PlantIdResponse diagnoseAndSave(
            Long cropId,
            MultipartFile image,
            Double latitude,
            Double longitude,
            boolean similarImages
    ) throws IOException {
        Crop crop = cropRepository.findById(cropId)
                .orElseThrow(() -> new RuntimeException("Crop not found"));

        PlantIdResponse response = plantIdClientService.fullyDiagnoseCrop(
                image,
                latitude,
                longitude,
                similarImages
        );

        Diagnosis diagnosis = buildDiagnosis(crop, response);

        diagnosisRepository.save(diagnosis);

        return response;
    }

    @Override
    public List<DiagnosisResponseDto> findAll() {
        return DiagnosisResponseDto.from(diagnosisRepository.findAll());
    }

    @Override
    public List<DiagnosisResponseDto> findAllByCropId(Long cropId) {
        if (!cropRepository.existsById(cropId)) {
            throw new RuntimeException("Crop not found");
        }

        return DiagnosisResponseDto.from(diagnosisRepository.findAllByCropId(cropId));
    }

    private Diagnosis buildDiagnosis(Crop crop, PlantIdResponse response) {
        String plantName = extractPlantName(response);
        String diseaseName = extractDiseaseName(response);
        Double confidence = extractDiseaseConfidence(response);
        Boolean isHealthy = extractIsHealthy(response);
        String treatment = extractTreatment(response);

        return new Diagnosis(
                crop,
                plantName,
                diseaseName,
                confidence,
                isHealthy,
                treatment
        );
    }

    private String extractPlantName(PlantIdResponse response) {
        if (response == null ||
                response.getResult() == null ||
                response.getResult().getClassification() == null ||
                response.getResult().getClassification().getSuggestions() == null ||
                response.getResult().getClassification().getSuggestions().isEmpty()) {
            return "Unknown plant";
        }

        return response.getResult()
                .getClassification()
                .getSuggestions()
                .getFirst()
                .getName();
    }

    private String extractDiseaseName(PlantIdResponse response) {
        if (response == null ||
                response.getResult() == null ||
                response.getResult().getDisease() == null ||
                response.getResult().getDisease().getSuggestions() == null ||
                response.getResult().getDisease().getSuggestions().isEmpty()) {
            return null;
        }

        return response.getResult()
                .getDisease()
                .getSuggestions()
                .getFirst()
                .getName();
    }

    private Double extractDiseaseConfidence(PlantIdResponse response) {
        if (response == null ||
                response.getResult() == null ||
                response.getResult().getDisease() == null ||
                response.getResult().getDisease().getSuggestions() == null ||
                response.getResult().getDisease().getSuggestions().isEmpty()) {
            return null;
        }

        return response.getResult()
                .getDisease()
                .getSuggestions()
                .getFirst()
                .getProbability();
    }

    private Boolean extractIsHealthy(PlantIdResponse response) {
        if (response == null ||
                response.getResult() == null ||
                response.getResult().getIsHealthy() == null) {
            return null;
        }

        return response.getResult()
                .getIsHealthy()
                .isBinary();
    }

    private String extractTreatment(PlantIdResponse response) {
        if (response == null ||
                response.getResult() == null ||
                response.getResult().getDisease() == null ||
                response.getResult().getDisease().getSuggestions() == null ||
                response.getResult().getDisease().getSuggestions().isEmpty() ||
                response.getResult().getDisease().getSuggestions().getFirst().getDetails() == null ||
                response.getResult().getDisease().getSuggestions().getFirst().getDetails().getTreatment() == null) {
            return null;
        }

        PlantIdResponse.Treatment treatment = response.getResult()
                .getDisease()
                .getSuggestions()
                .getFirst()
                .getDetails()
                .getTreatment();

        return Stream.of(
                        formatTreatmentSection("Biological", treatment.getBiological()),
                        formatTreatmentSection("Chemical", treatment.getChemical()),
                        formatTreatmentSection("Prevention", treatment.getPrevention())
                )
                .filter(section -> section != null && !section.isBlank())
                .reduce((first, second) -> first + "\n\n" + second)
                .orElse(null);
    }

    private String formatTreatmentSection(String title, List<String> items) {
        if (items == null || items.isEmpty()) {
            return null;
        }

        return title + ":\n- " + String.join("\n- ", items);
    }
}
