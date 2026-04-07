package mk.ukim.finki.uikt.biolense.backendbiolense.repositories;

import mk.ukim.finki.uikt.biolense.backendbiolense.models.Crop;
import mk.ukim.finki.uikt.biolense.backendbiolense.models.enumerations.CropStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CropRepository extends JpaRepository<Crop, Long> {

    List<Crop> findAllByUserId(Long userId);

    List<Crop> findAllByUserIdAndStatus(Long userId, CropStatus status);

    Optional<Crop> findByIdAndUserId(Long id, Long userId);

    boolean existsByIdAndUserId(Long id, Long userId);
}