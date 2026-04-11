package mk.ukim.finki.uikt.biolense.backendbiolense.exceptions.user;

public class InvalidEmailFormatException extends RuntimeException {
    public InvalidEmailFormatException(String email) {
        super(String.format("Invalid email format: %s", email));
    }
}
