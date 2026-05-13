package mk.ukim.finki.uikt.biolense.backendbiolense.repositories;

import mk.ukim.finki.uikt.biolense.backendbiolense.models.Field;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface FieldRepository extends JpaRepository<Field, Long> {
    @Query("SELECT f FROM Field f WHERE f.owner.id = :userId")
    List<Field> findFieldsByOwner(Long userId);
    @Query("SELECT f FROM Field f WHERE LOWER(f.name) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Field> searchFieldsByName(String keyword);
    boolean existsByName(String name);
    void deleteByOwnerId(Long ownerId);


}
