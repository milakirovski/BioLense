package mk.ukim.finki.uikt.biolense.backendbiolense.dtos.plantId.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class PlantIdUsageResponse {

    private boolean active;

    @JsonProperty("credit_limits")
    private CreditPeriods creditLimits;

    private CreditPeriods used;

    @JsonProperty("can_use_credits")
    private CanUseCredits canUseCredits;

    private CreditPeriods remaining;

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class CreditPeriods {
        private Integer day;
        private Integer week;
        private Integer month;
        private Integer total;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class CanUseCredits {
        private boolean value;
        private String reason;
    }
}
