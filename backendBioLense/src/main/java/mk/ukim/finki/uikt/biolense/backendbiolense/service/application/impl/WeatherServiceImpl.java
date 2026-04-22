package mk.ukim.finki.uikt.biolense.backendbiolense.service.application.impl;

import com.fasterxml.jackson.databind.JsonNode;
import mk.ukim.finki.uikt.biolense.backendbiolense.dtos.weather.WeatherResponseDto;
import mk.ukim.finki.uikt.biolense.backendbiolense.service.application.WeatherService;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@Service
public class WeatherServiceImpl implements WeatherService {

    private static final String BASE_URL = "https://api.open-meteo.com/v1/forecast";
    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public WeatherResponseDto getForecast(double lat, double lon) {
        String url = BASE_URL
                + "?latitude=" + lat
                + "&longitude=" + lon
                + "&daily=temperature_2m_max,temperature_2m_min,precipitation_sum"
                + "&timezone=auto&forecast_days=7";

        JsonNode response = restTemplate.getForObject(url, JsonNode.class);
        JsonNode daily = response.get("daily");
        JsonNode times = daily.get("time");
        JsonNode maxTemps = daily.get("temperature_2m_max");
        JsonNode minTemps = daily.get("temperature_2m_min");
        JsonNode precipitations = daily.get("precipitation_sum");

        List<WeatherResponseDto.DailyForecast> forecasts = new ArrayList<>();
        for (int i = 0; i < times.size(); i++) {
            forecasts.add(new WeatherResponseDto.DailyForecast(
                    times.get(i).asText(),
                    maxTemps.get(i).asDouble(),
                    minTemps.get(i).asDouble(),
                    precipitations.get(i).asDouble()
            ));
        }

        String recommendation;
        if (forecasts.size() > 1 && forecasts.get(1).precipitationMm() > 1.0) {
            recommendation = "Don't water today";
        } else {
            recommendation = "Water your crops";
        }

        return new WeatherResponseDto(forecasts, recommendation);
    }
}
