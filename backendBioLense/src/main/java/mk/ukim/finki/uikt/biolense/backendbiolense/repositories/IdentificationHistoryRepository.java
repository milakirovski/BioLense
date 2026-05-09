package mk.ukim.finki.uikt.biolense.backendbiolense.repositories;

import mk.ukim.finki.uikt.biolense.backendbiolense.models.IdentificationHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IdentificationHistoryRepository extends JpaRepository<IdentificationHistory, Long> {

    List<IdentificationHistory> findAllByCropId(Long cropId);
}