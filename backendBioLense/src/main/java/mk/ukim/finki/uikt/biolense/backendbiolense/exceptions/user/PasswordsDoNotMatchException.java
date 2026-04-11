package mk.ukim.finki.uikt.biolense.backendbiolense.exceptions.user;

public class PasswordsDoNotMatchException extends RuntimeException {
    public PasswordsDoNotMatchException() {
        super("Passwords do not match!");
    }
}
