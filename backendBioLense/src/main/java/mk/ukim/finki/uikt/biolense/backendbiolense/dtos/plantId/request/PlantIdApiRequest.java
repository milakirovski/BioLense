package mk.ukim.finki.uikt.biolense.backendbiolense.dtos.plantId.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class PlantIdApiRequest {
    private List<String> images;
    private Double latitude;
    private Double longitude;
    @JsonProperty("similar_images")
    private boolean similarImages;
    private String health;
    private String details;
}
