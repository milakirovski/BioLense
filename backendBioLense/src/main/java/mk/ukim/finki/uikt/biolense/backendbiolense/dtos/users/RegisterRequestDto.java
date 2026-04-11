package mk.ukim.finki.uikt.biolense.backendbiolense.dtos.users;

import mk.ukim.finki.uikt.biolense.backendbiolense.models.User;

public record RegisterRequestDto(
        String email, String password, String repeatPassword, String firstName, String lastName, String farmName
) {
}
