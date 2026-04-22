package mk.ukim.finki.uikt.biolense.backendbiolense.web;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import mk.ukim.finki.uikt.biolense.backendbiolense.dtos.weather.WeatherResponseDto;
import mk.ukim.finki.uikt.biolense.backendbiolense.service.application.WeatherService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "Weather", description = "Weather forecast and watering recommendations")
@RequestMapping("/api/weather")
public class WeatherController {

    private final WeatherService weatherService;

    public WeatherController(WeatherService weatherService) {
        this.weatherService = weatherService;
    }

    @GetMapping
    @Operation(summary = "Get 7-day weather forecast with watering recommendation")
    public WeatherResponseDto getForecast(@RequestParam double lat, @RequestParam double lon) {
        return weatherService.getForecast(lat, lon);
    }
}
