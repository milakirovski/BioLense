package mk.ukim.finki.uikt.biolense.backendbiolense.service.application.impl;

import lombok.extern.slf4j.Slf4j;
import mk.ukim.finki.uikt.biolense.backendbiolense.dtos.crops.PlantIdResponseDto;
import mk.ukim.finki.uikt.biolense.backendbiolense.service.application.PlantIdClientService;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Value;

import java.io.IOException;

@Slf4j
@Service
public class PlantIdClientServiceImpl implements PlantIdClientService {

    @Value("${plant.id.api.key}")
    private String apiKey;

    private final String baseUrl = "https://plant.id/api/v3/";

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public PlantIdResponseDto identifyPlant(MultipartFile image) throws IOException {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "multipart/form-data");
        headers.set("Api-Key", apiKey);

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("image", new ByteArrayResource(image.getBytes()) {
            @Override
            public String getFilename() {
                return image.getOriginalFilename();
            }
        });

        HttpEntity<MultiValueMap<String, Object>> request = new HttpEntity<>(body, headers);

        return restTemplate.postForObject(baseUrl + "identification", request, PlantIdResponseDto.class);
    }


    @Override
    public PlantIdResponseDto assessHealth(MultipartFile image) throws IOException {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "multipart/form-data");
        headers.set("Api-Key", apiKey);
        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("image", new ByteArrayResource(image.getBytes()) {
            @Override
            public String getFilename() {
                return image.getOriginalFilename();
            }
        });
        body.add("health", "only");
        HttpEntity<MultiValueMap<String, Object>> request = new HttpEntity<>(body, headers);
        return restTemplate.postForObject(baseUrl + "health_assessment", request, PlantIdResponseDto.class);

    }
}
