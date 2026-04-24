## Caching requests for Plant.id API

`models/PlantApiCache.java`
A single JPA entity that handles all four request types via an inner RequestType enum (IDENTIFY, HEALTH_ONLY, FULL_DIAGNOSIS, AUTO_DIAGNOSIS). 
Key columns:

* `cache_key` — SHA-256 of (requestType|imageHash|lat|lon), indexed, unique
* `image_hash` — SHA-256 of the raw image bytes (never stores the image itself)
* `latitude, longitude `— nullable GPS coords
* `response_payload `— full PlantIdResponse serialised as JSON (TEXT)
* `created_at` — timestamp

`repositories/PlantApiCacheRepository.java`

One method: findByCacheKey(String) — O(1) indexed lookup.

`helpers/ImageHashUtil.java`
Two static methods: sha256(byte[]) and buildCacheKey(requestType, imageHash, lat, lon).

`service/application/PlantIdCacheService.java + impl/PlantIdCacheServiceImpl.java`
lookup() deserialises a hit from JSON → PlantIdResponse. store() serialises and persists, with a guard against race conditions. Uses Spring Boot's auto-configured ObjectMapper.


`impl/PlantIdClientServiceImpl.java`
callIdentificationEndpoint() follows this flow:

1. Hash the image bytes (SHA-256)
2. cacheService.lookup(...) — return immediately on hit
3. Call Plant.id API on miss
4. cacheService.store(...) — persist the fresh result
5. Return response


### Production note
application-prod.properties uses ddl-auto=validate, so you'll need to create the plant_api_cache table before deploying. 

SQL:

    CREATE TABLE plant_api_cache (
    id            BIGSERIAL PRIMARY KEY,
    cache_key     VARCHAR(64)  NOT NULL UNIQUE,
    image_hash    VARCHAR(64)  NOT NULL,
    latitude      DOUBLE PRECISION,
    longitude     DOUBLE PRECISION,
    request_type  VARCHAR(20)  NOT NULL,
    response_payload TEXT       NOT NULL,
    created_at    TIMESTAMPTZ  NOT NULL
    );
    CREATE INDEX idx_plant_api_cache_key ON plant_api_cache(cache_key);
H2 (dev) creates it automatically via create-drop.