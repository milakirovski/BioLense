package mk.ukim.finki.uikt.biolense.backendbiolense.dtos.users;

public record UpdateProfileRequestDto(
        String firstName,
        String lastName,
        String farmName
) {
}
