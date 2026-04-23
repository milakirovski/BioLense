package mk.ukim.finki.uikt.biolense.backendbiolense.dtos.plantId.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

/**
 * <h1>Your API Contract</h1>
 * <p><u>This is what the backend exposes to the frontend/clients.</u></p>
 *
 * <p>Its job is to present a clean, intentional shape that fits your application's needs.</p>
 *
 * <p>It belongs to the controller/service layer.</p>
 */

@Data
@Builder
public class HealthAssessmentResponse {
    private String accessToken;
    private String status;
    private Identification identification;
    private Health health;

    @Data
    @Builder
    public static class Identification {
        private PlantStatus isPlant;
        private List<PlantSuggestion> suggestions;
    }

    @Data
    @Builder
    public static class Health {
        private PlantStatus isHealthy;
        private List<DiseaseResult> diseases;
    }

    @Data
    @Builder
    public static class PlantStatus {
        private boolean result;
        private double probability;
        private double threshold;
    }

    @Data
    @Builder
    public static class PlantSuggestion {
        private String name;
        private List<String> commonNames;
        private double probability;
        private String url;
        private List<String> similarImages;
    }

    @Data
    @Builder
    public static class DiseaseResult {
        private String name;
        private List<String> commonNames;
        private String localName;
        private List<String> classification;
        private double probability;
        private Treatment treatment;
        private List<String> similarImages;
    }

    @Data
    @Builder
    public static class Treatment {
        private List<String> biological;
        private List<String> chemical;
        private List<String> prevention;
    }
}
