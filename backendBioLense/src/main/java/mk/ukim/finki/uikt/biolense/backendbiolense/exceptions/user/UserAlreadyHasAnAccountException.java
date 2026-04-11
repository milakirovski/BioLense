package mk.ukim.finki.uikt.biolense.backendbiolense.exceptions.user;

public class UserAlreadyHasAnAccountException extends RuntimeException{
    public UserAlreadyHasAnAccountException(String email) {
        super(String.format("User with email %s already has an account", email));
    }
}
