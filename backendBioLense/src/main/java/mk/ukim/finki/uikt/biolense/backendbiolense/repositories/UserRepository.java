package mk.ukim.finki.uikt.biolense.backendbiolense.repositories;

import mk.ukim.finki.uikt.biolense.backendbiolense.models.User;
import mk.ukim.finki.uikt.biolense.backendbiolense.models.enumerations.UserRole;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    @EntityGraph(attributePaths = {"crops"})
    List<User> findAll();

    Optional<User> findByEmail(String email);

    @EntityGraph(attributePaths = {"crops"})
    Optional<User> findWithCropsByEmail(String email);

    boolean existsByEmail(String email);

    List<User> findAllByRole(UserRole role);

    List<User> findAllByIsActive(Boolean isActive);
}