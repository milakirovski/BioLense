package mk.ukim.finki.uikt.biolense.backendbiolense.dtos.weather;

import java.util.List;

public record WeatherResponseDto(
        List<DailyForecast> forecast,
        String wateringRecommendation
) {
    public record DailyForecast(
            String date,
            Double temperatureMax,
            Double temperatureMin,
            Double precipitationMm
    ) {}
}
