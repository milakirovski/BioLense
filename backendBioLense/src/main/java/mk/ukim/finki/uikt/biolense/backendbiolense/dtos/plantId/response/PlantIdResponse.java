package mk.ukim.finki.uikt.biolense.backendbiolense.dtos.plantId.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

/**
 * <h1>External API Contract</h1>
 * <p><u>This is a mirror of what Plant.id sends back.</u></p>
 *
 * <p>Its only job is to deserialize the raw JSON from the external API. </p>
 *
 * <p>It belongs to the client/integration layer and reflects their naming conventions, structure, and quirks.</p>
 */

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class PlantIdResponse {

    @JsonProperty("access_token")
    private String accessToken;

    private String status;
    private Result result;

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true) // ako vrakja API-to fields sto ne se navedeni vo Java klasata, sprecuva da se frli Exception so null gi popolnuva
    public static class Result {
        @JsonProperty("is_plant")
        private Prediction isPlant;

        @JsonProperty("is_healthy")
        private Prediction isHealthy;

        private Classification classification;
        private Disease disease;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Prediction {
        private boolean binary;
        private double probability;
        private double threshold;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Classification {
        private List<Suggestion> suggestions;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Disease {
        private List<DiseaseSuggestion> suggestions;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Suggestion {
        private String name;
        private double probability;
        private SuggestionDetails details;

        @JsonProperty("similar_images")
        private List<SimilarImage> similarImages;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class DiseaseSuggestion {
        private String name;
        private double probability;
        private DiseaseDetails details;

        @JsonProperty("similar_images")
        private List<SimilarImage> similarImages;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class SuggestionDetails {
        @JsonProperty("common_names")
        private List<String> commonNames;
        private String url;
        private String description;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class DiseaseDetails {
        @JsonProperty("common_names")
        private List<String> commonNames;
        @JsonProperty("local_name")
        private String localName;
        private List<String> classification;
        private Treatment treatment;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Treatment {
        private List<String> biological;
        private List<String> chemical;
        private List<String> prevention;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class SimilarImage {
        private String url;
    }
}
