package mk.ukim.finki.uikt.biolense.backendbiolense.dtos.users;

import mk.ukim.finki.uikt.biolense.backendbiolense.dtos.crops.ResponseCropDto;
import mk.ukim.finki.uikt.biolense.backendbiolense.models.User;
import mk.ukim.finki.uikt.biolense.backendbiolense.models.enumerations.UserRole;

import java.util.List;

public record DisplayUserDto(
        Long id,
        String email,
        String firstName,
        String lastName,
        String farmName,
        UserRole role,
        Boolean isActive,
        String createdAt,
        List<ResponseCropDto> cropsList
) {

    public static DisplayUserDto from(User user) {
        return new DisplayUserDto(
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getFarmName(),
                user.getRole(),
                user.getIsActive(),
                user.getCreatedAt().toString(),
                ResponseCropDto.from(user.getCrops()));
    }

    public static List<DisplayUserDto> from(List<User> users) {
        return users.stream().map(DisplayUserDto::from).toList();
    }

}
