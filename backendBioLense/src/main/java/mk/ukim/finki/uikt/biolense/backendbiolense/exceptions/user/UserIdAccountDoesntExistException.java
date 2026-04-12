package mk.ukim.finki.uikt.biolense.backendbiolense.exceptions.user;

public class UserIdAccountDoesntExistException extends RuntimeException {
    public UserIdAccountDoesntExistException() {
        super("User doesn't exist");
    }
}
