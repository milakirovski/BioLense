package mk.ukim.finki.uikt.biolense.backendbiolense.dtos.crops;

import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class PlantIdResponseDto {
    private String accessToken;

    private Result result;

    @Data
    public static class Result {
        private IsPlant isPlant;
        private Classification classification;
        private IsHealthy isHealthy;
        private Disease disease;
    }

    @Data
    public static class IsPlant {
        private Boolean binary;
        private Double probability;
    }

    @Data
    public static class Classification {
        private List<Suggestion> suggestions;
    }

    @Data
    public static class Suggestion {
        private String id;
        private String name;
        private Double probability;
        private List<SimilarImage> similarImages;
        private Map<String, Object> details;       // common_names, url, description, taxonomy, etc.
    }

    @Data
    public static class SimilarImage {
        private String url;
        private String licenseName;
        private String licenseUrl;
        private String citation;
    }

    @Data
    public static class IsHealthy {
        private Boolean binary;
        private Double probability;
    }

    @Data
    public static class Disease {
        private List<DiseaseSuggestion> suggestions;
        private Question question;
    }

    @Data
    public static class DiseaseSuggestion {
        private String id;
        private String name;
        private Double probability;
        private List<SimilarImage> similarImages;
        private Map<String, Object> details;
    }

    @Data
    public static class Question {
        private String text;
        private List<Option> options;
    }

    @Data
    public static class Option {
        private Integer suggestionIndex;
        private String entityId;
        private String name;
    }


}
