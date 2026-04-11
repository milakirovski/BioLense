package mk.ukim.finki.uikt.biolense.backendbiolense.exceptions.crop;

public class CropIsAlreadyHarvestedException extends RuntimeException {
    public CropIsAlreadyHarvestedException() {
        super("Crop is already harvested.");
    }
}
