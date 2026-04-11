package mk.ukim.finki.uikt.biolense.backendbiolense.service.application.impl;

import mk.ukim.finki.uikt.biolense.backendbiolense.dtos.users.DisplayUserDto;
import mk.ukim.finki.uikt.biolense.backendbiolense.dtos.users.LoginRequestDto;
import mk.ukim.finki.uikt.biolense.backendbiolense.dtos.users.LoginResponseDto;
import mk.ukim.finki.uikt.biolense.backendbiolense.dtos.users.RegisterRequestDto;
import mk.ukim.finki.uikt.biolense.backendbiolense.dtos.users.UpdateProfileRequestDto;
import mk.ukim.finki.uikt.biolense.backendbiolense.helpers.JwtHelper;
import mk.ukim.finki.uikt.biolense.backendbiolense.models.User;
import mk.ukim.finki.uikt.biolense.backendbiolense.service.application.UserApplicationService;
import mk.ukim.finki.uikt.biolense.backendbiolense.service.domain.UserService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserApplicationServiceImpl implements UserApplicationService {

    private final UserService userService;
    private final JwtHelper jwtHelper;

    public UserApplicationServiceImpl(UserService userService, JwtHelper jwtHelper) {
        this.userService = userService;
        this.jwtHelper = jwtHelper;
    }

    @Override
    public DisplayUserDto register(RegisterRequestDto registerUserDto) {
        User user = userService.register(
                registerUserDto.email(),
                registerUserDto.password(),
                registerUserDto.repeatPassword(),
                registerUserDto.firstName(),
                registerUserDto.lastName(),
                registerUserDto.farmName());
        return DisplayUserDto.from(user);
    }

    @Override
    public LoginResponseDto login(LoginRequestDto loginUserDto) {
        User user = userService.login(loginUserDto.email(), loginUserDto.password());

        String token = jwtHelper.generateToken(user);

        return new LoginResponseDto(token);
    }

    @Override
    public List<DisplayUserDto> findAll() {
        return DisplayUserDto.from(userService.findAll());
    }

    @Override
    public DisplayUserDto findByEmail(String email) {
        return DisplayUserDto.from(userService.findUserByEmail(email));
    }

    @Override
    public DisplayUserDto updateProfile(String email, UpdateProfileRequestDto dto) {
        return DisplayUserDto.from(userService.updateProfile(email, dto));
    }

    @Override
    public List<DisplayUserDto> findByIsActivated(Boolean isActivated) {
        return DisplayUserDto.from(userService.findByStatus(isActivated));
    }
}
