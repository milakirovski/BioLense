package mk.ukim.finki.uikt.biolense.backendbiolense.exceptions.user;

public class PasswordLengthException extends RuntimeException {
    public PasswordLengthException() {
        super("Password must be at least 6 characters long");
    }
}
