package mk.ukim.finki.uikt.biolense.backendbiolense.service.domain;

import mk.ukim.finki.uikt.biolense.backendbiolense.dtos.users.UpdateProfileRequestDto;
import mk.ukim.finki.uikt.biolense.backendbiolense.models.User;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.List;

public interface UserService extends UserDetailsService {

    // create user = admin only

    // findAll = admin only
    List<User> findAll();

    // findById = admin only

    // delete User // admin only

    // findUserByEmail
    User findUserByEmail(String email);


    // update user information = user only
    User updateProfile(String email, UpdateProfileRequestDto dto);


    User register(String email, String password, String repeatPassword, String firstName, String lastName, String farmName);

    // login
    User login(String email, String password);

    // list User Profile details

    //list users based on active or inactive status
    List<User> findByStatus(Boolean isActive);
}
