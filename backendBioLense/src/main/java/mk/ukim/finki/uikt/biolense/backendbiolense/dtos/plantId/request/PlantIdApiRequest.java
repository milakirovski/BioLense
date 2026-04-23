package mk.ukim.finki.uikt.biolense.backendbiolense.dtos.plantId.request;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class PlantIdApiRequest {
    private List<String> images;
    private Double latitude;
    private Double longitude;
}
