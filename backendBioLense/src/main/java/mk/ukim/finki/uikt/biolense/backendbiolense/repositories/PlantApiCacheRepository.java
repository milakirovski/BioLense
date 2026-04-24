package mk.ukim.finki.uikt.biolense.backendbiolense.repositories;

import mk.ukim.finki.uikt.biolense.backendbiolense.models.PlantApiCache;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PlantApiCacheRepository extends JpaRepository<PlantApiCache, Long> {

    Optional<PlantApiCache> findByCacheKey(String cacheKey);
}
