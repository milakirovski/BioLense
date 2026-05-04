package mk.ukim.finki.uikt.biolense.backendbiolense.service.application.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.RequiredArgsConstructor;
import mk.ukim.finki.uikt.biolense.backendbiolense.dtos.plantId.response.DiagnosisResponseDto;
import mk.ukim.finki.uikt.biolense.backendbiolense.dtos.plantId.response.HealthAssessmentResponse;
import mk.ukim.finki.uikt.biolense.backendbiolense.dtos.plantId.response.IdHistoryResponseDto;
import mk.ukim.finki.uikt.biolense.backendbiolense.dtos.plantId.response.PlantIdResponse;
import mk.ukim.finki.uikt.biolense.backendbiolense.models.Crop;
import mk.ukim.finki.uikt.biolense.backendbiolense.models.Diagnosis;
import mk.ukim.finki.uikt.biolense.backendbiolense.models.IdentificationHistory;
import mk.ukim.finki.uikt.biolense.backendbiolense.repositories.CropRepository;
import mk.ukim.finki.uikt.biolense.backendbiolense.repositories.DiagnosisRepository;
import mk.ukim.finki.uikt.biolense.backendbiolense.repositories.IdentificationHistoryRepository;
import mk.ukim.finki.uikt.biolense.backendbiolense.service.application.CropDiagnosisService;
import mk.ukim.finki.uikt.biolense.backendbiolense.service.application.PlantIdClientService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class CropDiagnosisServiceImpl implements CropDiagnosisService {

    private final CropRepository cropRepository;
    private final DiagnosisRepository diagnosisRepository;
    private final PlantIdClientService plantIdClientService;
    private final IdentificationHistoryRepository identificationHistoryRepository;
    private final ObjectMapper objectMapper;

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

        HealthAssessmentResponse mappedResponse = mapToHealthAssessmentResponse(response);
        IdentificationHistory identificationHistory = buildIdentificationHistory(crop, mappedResponse);

        identificationHistoryRepository.save(identificationHistory);

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

    private IdentificationHistory buildIdentificationHistory(
            Crop crop,
            HealthAssessmentResponse mappedResponse
    ) {
        HealthAssessmentResponse.PlantSuggestion topPlantSuggestion = getFirstOrNull(
                mappedResponse.getIdentification() != null
                        ? mappedResponse.getIdentification().getSuggestions()
                        : null
        );

        HealthAssessmentResponse.DiseaseResult topDisease = getFirstOrNull(
                mappedResponse.getHealth() != null
                        ? mappedResponse.getHealth().getDiseases()
                        : null
        );

        HealthAssessmentResponse.PlantStatus plantStatus =
                mappedResponse.getIdentification() != null
                        ? mappedResponse.getIdentification().getIsPlant()
                        : null;

        HealthAssessmentResponse.PlantStatus healthStatus =
                mappedResponse.getHealth() != null
                        ? mappedResponse.getHealth().getIsHealthy()
                        : null;

        return new IdentificationHistory(
                crop,
                mappedResponse.getAccessToken(),
                mappedResponse.getStatus(),
                topPlantSuggestion != null ? topPlantSuggestion.getName() : null,
                topPlantSuggestion != null ? topPlantSuggestion.getProbability() : null,
                plantStatus != null ? plantStatus.isResult() : null,
                healthStatus != null ? healthStatus.isResult() : null,
                healthStatus != null ? healthStatus.getProbability() : null,
                topDisease != null ? topDisease.getName() : null,
                topDisease != null ? topDisease.getProbability() : null,
                toJson(mappedResponse)
        );
    }
    private HealthAssessmentResponse mapToHealthAssessmentResponse(PlantIdResponse response) {
        PlantIdResponse.Result result = response != null ? response.getResult() : null;

        return HealthAssessmentResponse.builder()
                .accessToken(response != null ? response.getAccessToken() : null)
                .status(response != null ? response.getStatus() : null)
                .identification(
                        HealthAssessmentResponse.Identification.builder()
                                .isPlant(mapPlantStatus(result != null ? result.getIsPlant() : null))
                                .suggestions(mapPlantSuggestions(result))
                                .build()
                )
                .health(
                        HealthAssessmentResponse.Health.builder()
                                .isHealthy(mapPlantStatus(result != null ? result.getIsHealthy() : null))
                                .diseases(mapDiseaseResults(result))
                                .build()
                )
                .build();
    }

    private HealthAssessmentResponse.PlantStatus mapPlantStatus(PlantIdResponse.Prediction prediction) {
        if (prediction == null) {
            return null;
        }

        return HealthAssessmentResponse.PlantStatus.builder()
                .result(prediction.isBinary())
                .probability(prediction.getProbability())
                .threshold(prediction.getThreshold())
                .build();
    }

    private List<HealthAssessmentResponse.PlantSuggestion> mapPlantSuggestions(PlantIdResponse.Result result) {
        if (result == null ||
                result.getClassification() == null ||
                result.getClassification().getSuggestions() == null) {
            return Collections.emptyList();
        }

        return result.getClassification()
                .getSuggestions()
                .stream()
                .map(suggestion -> HealthAssessmentResponse.PlantSuggestion.builder()
                        .name(suggestion.getName())
                        .commonNames(
                                suggestion.getDetails() != null
                                        ? suggestion.getDetails().getCommonNames()
                                        : Collections.emptyList()
                        )
                        .probability(suggestion.getProbability())
                        .url(
                                suggestion.getDetails() != null
                                        ? suggestion.getDetails().getUrl()
                                        : null
                        )
                        .similarImages(mapSimilarImages(suggestion.getSimilarImages()))
                        .build()
                )
                .toList();
    }

    private List<HealthAssessmentResponse.DiseaseResult> mapDiseaseResults(PlantIdResponse.Result result) {
        if (result == null ||
                result.getDisease() == null ||
                result.getDisease().getSuggestions() == null) {
            return Collections.emptyList();
        }

        return result.getDisease()
                .getSuggestions()
                .stream()
                .map(disease -> HealthAssessmentResponse.DiseaseResult.builder()
                        .name(disease.getName())
                        .commonNames(
                                disease.getDetails() != null
                                        ? disease.getDetails().getCommonNames()
                                        : Collections.emptyList()
                        )
                        .localName(
                                disease.getDetails() != null
                                        ? disease.getDetails().getLocalName()
                                        : null
                        )
                        .classification(
                                disease.getDetails() != null
                                        ? disease.getDetails().getClassification()
                                        : Collections.emptyList()
                        )
                        .probability(disease.getProbability())
                        .treatment(mapTreatment(
                                disease.getDetails() != null
                                        ? disease.getDetails().getTreatment()
                                        : null
                        ))
                        .similarImages(mapSimilarImages(disease.getSimilarImages()))
                        .build()
                )
                .toList();
    }

    private HealthAssessmentResponse.Treatment mapTreatment(PlantIdResponse.Treatment treatment) {
        if (treatment == null) {
            return null;
        }

        return HealthAssessmentResponse.Treatment.builder()
                .biological(treatment.getBiological())
                .chemical(treatment.getChemical())
                .prevention(treatment.getPrevention())
                .build();
    }

    private List<String> mapSimilarImages(List<PlantIdResponse.SimilarImage> similarImages) {
        if (similarImages == null) {
            return Collections.emptyList();
        }

        return similarImages.stream()
                .map(PlantIdResponse.SimilarImage::getUrl)
                .toList();
    }

    private String toJson(HealthAssessmentResponse response) {
        return objectMapper.writeValueAsString(response);
    }

    private <T> T getFirstOrNull(List<T> items) {
        if (items == null || items.isEmpty()) {
            return null;
        }

        return items.get(0);
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
                .get(0)
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
                .get(0)
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
                .get(0)
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
                response.getResult().getDisease().getSuggestions().get(0).getDetails() == null ||
                response.getResult().getDisease().getSuggestions().get(0).getDetails().getTreatment() == null) {
            return null;
        }

        PlantIdResponse.Treatment treatment = response.getResult()
                .getDisease()
                .getSuggestions()
                .get(0)
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

    @Override
    public List<IdHistoryResponseDto> findIdentificationHistoryByCropId(Long cropId) {
        if (!cropRepository.existsById(cropId)) {
            throw new RuntimeException("Crop not found");
        }

        return IdHistoryResponseDto.from(
                identificationHistoryRepository.findAllByCropId(cropId)
        );
    }
}
