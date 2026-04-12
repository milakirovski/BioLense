package mk.ukim.finki.uikt.biolense.backendbiolense.exceptions.user;

public class UserAccountDoesntExist extends RuntimeException {
    public UserAccountDoesntExist(String email) {
        super(String.format("User with email %s doesn't exist. You need to be registered first.", email));
    }
}
