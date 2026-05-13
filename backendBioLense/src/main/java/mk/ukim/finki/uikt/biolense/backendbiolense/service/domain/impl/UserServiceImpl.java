package mk.ukim.finki.uikt.biolense.backendbiolense.service.domain.impl;

import mk.ukim.finki.uikt.biolense.backendbiolense.dtos.users.UpdateProfileRequestDto;
import mk.ukim.finki.uikt.biolense.backendbiolense.exceptions.user.*;
import mk.ukim.finki.uikt.biolense.backendbiolense.models.User;
import mk.ukim.finki.uikt.biolense.backendbiolense.repositories.UserRepository;
import mk.ukim.finki.uikt.biolense.backendbiolense.service.domain.UserService;
import org.jspecify.annotations.NonNull;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public User register(String email, String password, String repeatPassword, String firstName, String lastName, String farmName) throws UserAlreadyHasAnAccountException, InvalidEmailFormatException, PasswordLengthException, PasswordsDoNotMatchException{
        // user existence validation
        Optional<User> user = userRepository.findByEmail(email);
        if(user.isPresent()) throw new UserAlreadyHasAnAccountException(email);


        // email validation
        if(!email.contains("@")){
            throw new InvalidEmailFormatException(email);
        }

        // password validation
        if(password.length() < 6) throw new PasswordLengthException();
        if (!password.equals(repeatPassword)) throw new PasswordsDoNotMatchException();

        // register user
        User newUser = new User(email, passwordEncoder.encode(password), firstName, lastName, farmName);
        return userRepository.save(newUser);
    }

    @Override
    public User login(String email, String password) throws UserAccountDoesntExist, InvalidUserCredentialsException{
        User user = userRepository.findByEmail(email).orElseThrow(() -> new UserAccountDoesntExist(email));

        if (!passwordEncoder.matches(password, user.getPasswordHash())) throw new InvalidUserCredentialsException();

        return user;
    }

    @Override
    public List<User> findAll() {
        return userRepository.findAll();
    }

    @Override
    public User findUserByEmail(String email) {
        return userRepository.findWithCropsByEmail(email).orElseThrow(() -> new UserAccountDoesntExist(email));
    }

    @Override
    public User updateProfile(User user, UpdateProfileRequestDto dto) {
        if (dto.firstName() != null) user.setFirstName(dto.firstName());
        if (dto.lastName() != null) user.setLastName(dto.lastName());
        if (dto.farmName() != null) user.setFarmName(dto.farmName());
        if (dto.email() != null) user.setEmail(dto.email());
        if (dto.password() != null) user.setPasswordHash(passwordEncoder.encode(dto.password()));
        return userRepository.save(user);
    }

    @Override
    public void deleteAccount(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new UserAccountDoesntExist(email));
        userRepository.delete(user);
    }

    @Override
    public UserDetails loadUserByUsername(@NonNull String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException(email));
    }

    @Override
    public List<User> findByStatus(Boolean isActive) {
        return findAll().stream()
                .filter(user -> user.getIsActive().equals(isActive))
                .toList();
    }
}
