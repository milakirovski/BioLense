package mk.ukim.finki.uikt.biolense.backendbiolense.service.application;

import mk.ukim.finki.uikt.biolense.backendbiolense.dtos.weather.WeatherResponseDto;

public interface WeatherService {

    WeatherResponseDto getForecast(double lat, double lon);
}
