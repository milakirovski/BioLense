package mk.ukim.finki.uikt.biolense.backendbiolense.service.application.impl;

import com.fasterxml.jackson.databind.JsonNode;
import mk.ukim.finki.uikt.biolense.backendbiolense.dtos.weather.WeatherResponseDto;
import mk.ukim.finki.uikt.biolense.backendbiolense.service.application.WeatherService;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@Service
public class WeatherServiceImpl implements WeatherService {

    private static final String BASE_URL = "https://api.open-meteo.com/v1/forecast";

    private static final String DAILY_PARAMS =
            "temperature_2m_max,temperature_2m_min" +
                    ",precipitation_sum,precipitation_probability_max" +
                    ",relative_humidity_2m_max" +
                    ",windspeed_10m_max";

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public WeatherResponseDto getForecast(double lat, double lon) {
        String url = BASE_URL
                + "?latitude=" + lat
                + "&longitude=" + lon
                + "&daily=" + DAILY_PARAMS
                + "&timezone=auto"
                + "&forecast_days=7";

        JsonNode response;
        try {
            response = restTemplate.getForObject(url, JsonNode.class);
        } catch (RestClientException e) {
            throw new RuntimeException("Failed to fetch weather data: " + e.getMessage(), e);
        }

        if (response == null || !response.has("daily")) {
            throw new RuntimeException("Invalid response from Open-Meteo API");
        }

        JsonNode daily      = response.get("daily");
        JsonNode times      = daily.get("time");
        JsonNode maxTemps   = daily.get("temperature_2m_max");
        JsonNode minTemps   = daily.get("temperature_2m_min");
        JsonNode precip     = daily.get("precipitation_sum");
        JsonNode precipProb = daily.get("precipitation_probability_max");
        JsonNode humidity   = daily.get("relative_humidity_2m_max");
        JsonNode windSpeed  = daily.get("windspeed_10m_max");

        List<WeatherResponseDto.DailyForecast> forecasts = new ArrayList<>();

        for (int i = 0; i < times.size(); i++) {
            forecasts.add(new WeatherResponseDto.DailyForecast(
                    safeString(times, i),
                    safeDouble(maxTemps, i),
                    safeDouble(minTemps, i),
                    safeDouble(precip, i),
                    safeInt(precipProb, i),
                    safeInt(humidity, i),
                    safeDouble(windSpeed, i)
            ));
        }

        String wateringRec = buildWateringRecommendation(forecasts);

        return new WeatherResponseDto(forecasts, wateringRec);
    }

    private String buildWateringRecommendation(List<WeatherResponseDto.DailyForecast> forecasts) {
        if (forecasts.isEmpty()) return "No forecast data available.";

        WeatherResponseDto.DailyForecast tomorrow = forecasts.size() > 1 ? forecasts.get(1) : forecasts.get(0);

        Double precip      = tomorrow.precipitationMm();
        Integer precipProb = tomorrow.precipitationProbability();

        boolean rainLikely = (precip != null && precip >= 3.0) && (precipProb != null && precipProb >= 60);

        if (rainLikely) {
            return "Don't water today — rain coming (" + precip + " mm, " + precipProb + "% chance).";
        }

        return "No significant rain expected. Water your crops.";
    }

    private Double safeDouble(JsonNode array, int index) {
        if (array == null || index >= array.size() || array.get(index).isNull()) return null;
        return array.get(index).asDouble();
    }

    private Integer safeInt(JsonNode array, int index) {
        if (array == null || index >= array.size() || array.get(index).isNull()) return null;
        return array.get(index).asInt();
    }

    private String safeString(JsonNode array, int index) {
        if (array == null || index >= array.size() || array.get(index).isNull()) return null;
        return array.get(index).asText();
    }
}