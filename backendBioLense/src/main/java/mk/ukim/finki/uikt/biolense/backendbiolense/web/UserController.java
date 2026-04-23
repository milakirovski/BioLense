package mk.ukim.finki.uikt.biolense.backendbiolense.web;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import mk.ukim.finki.uikt.biolense.backendbiolense.dtos.users.DisplayUserDto;
import mk.ukim.finki.uikt.biolense.backendbiolense.dtos.users.LoginRequestDto;
import mk.ukim.finki.uikt.biolense.backendbiolense.dtos.users.RegisterRequestDto;
import mk.ukim.finki.uikt.biolense.backendbiolense.dtos.users.UpdateProfileRequestDto;
import mk.ukim.finki.uikt.biolense.backendbiolense.exceptions.user.*;
import mk.ukim.finki.uikt.biolense.backendbiolense.models.User;
import mk.ukim.finki.uikt.biolense.backendbiolense.service.application.UserApplicationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Tag(name = "User", description = "The user API")
@RequestMapping("/api/users")
public class UserController {

    private final UserApplicationService userApplicationService;

    public UserController(UserApplicationService userApplicationService) {
        this.userApplicationService = userApplicationService;
    }

    @GetMapping("/all")
    @Operation(summary = "Get all users", description = "Get all users from the system")
//    @PreAuthorize( "hasRole('ADMIN')")
    public List<DisplayUserDto> findAll() {
        return userApplicationService.findAll();
    }

    @PostMapping("/register")
    @Operation(summary = "Register user", description = "Registers user into the system, create a record in the Users table in the db")
    public ResponseEntity<?> register(@RequestBody RegisterRequestDto registerUserDto) {
        try {
            return ResponseEntity.ok(userApplicationService.register(registerUserDto));
        } catch (InvalidEmailFormatException | PasswordsDoNotMatchException exception) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(exception.getMessage());
        } catch(UserAlreadyHasAnAccountException | PasswordLengthException exception){
            return ResponseEntity.status(HttpStatus.CONFLICT).body(exception.getMessage());
        }
    }

    @Operation(summary = "User login", description = "Authenticates an user and generates a JWT")
    @ApiResponses(
            value = {
                    @ApiResponse(responseCode = "200", description = "User authenticated successfully"),
                    @ApiResponse(responseCode = "404", description = "Invalid username or password")
            }
    )
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDto loginRequestDto) {
        try {
            return ResponseEntity.ok(userApplicationService.login(loginRequestDto));
        } catch (InvalidUserCredentialsException exception)  {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(exception.getMessage());
        } catch (UserAccountDoesntExist exception) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(exception.getMessage());
        }
    }

    @Operation(summary = "User logout", description = "Ends user's session")
    @ApiResponse(responseCode = "200", description = "User logged out successfully")
    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok("Logged out successfully. Please discard your token.");
    }

    @GetMapping("/me")
    @Operation(summary = "Get current user", description = "Returns the profile of the currently authenticated user")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal User currentUser) {
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No active session. No user is logged in yet.");
        }
        return ResponseEntity.ok(userApplicationService.findByEmail(currentUser.getEmail()));
    }

    @PutMapping("/profile")
    @Operation(summary = "Update profile", description = "Updates the first name, last name or farm name of the currently authenticated user")
    public ResponseEntity<?> updateProfile(@AuthenticationPrincipal User currentUser,
                                           @RequestBody UpdateProfileRequestDto dto) {
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No active session. No user is logged in yet.");
        }
        return ResponseEntity.ok(userApplicationService.updateProfile(currentUser.getEmail(), dto));
    }

    @DeleteMapping("/profile")
    @Operation(summary = "Delete account", description = "Permanently deletes the currently authenticated user and all their crops")
    public ResponseEntity<String> deleteAccount(@AuthenticationPrincipal User currentUser) {
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No active session. No user is logged in yet.");
        }
        userApplicationService.deleteAccount(currentUser.getEmail());
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok("Account successfully deleted.");
    }

    @GetMapping("/find-by-email")
    public ResponseEntity<?> getUserByEmail(@RequestParam String email) {
        try{
            return ResponseEntity.ok(userApplicationService.findByEmail(email));
        }catch (UserAccountDoesntExist exception){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(exception.getMessage());
        }
    }

    @GetMapping("/isActive")
    public List<DisplayUserDto> findByStatus(@RequestParam Boolean isActive){
        return userApplicationService.findByIsActivated(isActive);
    }
}
