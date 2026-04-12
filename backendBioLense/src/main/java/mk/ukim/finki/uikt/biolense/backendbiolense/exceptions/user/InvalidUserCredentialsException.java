package mk.ukim.finki.uikt.biolense.backendbiolense.exceptions.user;

public class InvalidUserCredentialsException extends RuntimeException {
    public InvalidUserCredentialsException() {
        super("Invalid user credentials.");
    }
}
