package mk.ukim.finki.uikt.biolense.backendbiolense.service.application;

import mk.ukim.finki.uikt.biolense.backendbiolense.dtos.users.DisplayUserDto;
import mk.ukim.finki.uikt.biolense.backendbiolense.dtos.users.LoginRequestDto;
import mk.ukim.finki.uikt.biolense.backendbiolense.dtos.users.LoginResponseDto;
import mk.ukim.finki.uikt.biolense.backendbiolense.dtos.users.RegisterRequestDto;

import java.util.List;

public interface UserApplicationService {

    DisplayUserDto register(RegisterRequestDto registerUserDto);

    LoginResponseDto login(LoginRequestDto loginUserDto);

    List<DisplayUserDto> findAll();

    DisplayUserDto findByEmail(String email);
}
