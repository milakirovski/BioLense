package mk.ukim.finki.uikt.biolense.backendbiolense.exceptions.crop;

public class CropNotFoundException extends RuntimeException {
    public CropNotFoundException() {
        super("Crop not found.");
    }
}
