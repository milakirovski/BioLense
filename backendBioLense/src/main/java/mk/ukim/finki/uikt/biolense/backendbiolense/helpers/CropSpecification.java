package mk.ukim.finki.uikt.biolense.backendbiolense.helpers;

import mk.ukim.finki.uikt.biolense.backendbiolense.models.Crop;
import mk.ukim.finki.uikt.biolense.backendbiolense.models.enumerations.CropStatus;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;

public class CropSpecification {

    public static Specification<Crop> hasPlantType(String plantType) {
        return (root, query, cb) ->
                plantType == null ? null :
                cb.like(cb.lower(root.get("plantType")), "%" + plantType.toLowerCase() + "%");
    }

    public static Specification<Crop> hasFieldName(String fieldName) {
        return (root, query, cb) ->
                fieldName == null ? null :
                cb.like(cb.lower(root.get("fieldName")), "%" + fieldName.toLowerCase() + "%");
    }

    public static Specification<Crop> hasStatus(CropStatus status) {
        return (root, query, cb) ->
                status == null ? null :
                cb.equal(root.get("status"), status);
    }

    public static Specification<Crop> plantedAtFrom(LocalDate from) {
        return (root, query, cb) ->
                from == null ? null :
                cb.greaterThanOrEqualTo(root.get("plantedAt"), from);
    }

    public static Specification<Crop> plantedAtTo(LocalDate to) {
        return (root, query, cb) ->
                to == null ? null :
                cb.lessThanOrEqualTo(root.get("plantedAt"), to);
    }

    public static Specification<Crop> expectedHarvestAtFrom(LocalDate from) {
        return (root, query, cb) ->
                from == null ? null :
                cb.greaterThanOrEqualTo(root.get("expectedHarvestAt"), from);
    }

    public static Specification<Crop> expectedHarvestAtTo(LocalDate to) {
        return (root, query, cb) ->
                to == null ? null :
                cb.lessThanOrEqualTo(root.get("expectedHarvestAt"), to);
    }

    public static Specification<Crop> harvestedAtFrom(LocalDate from) {
        return (root, query, cb) ->
                from == null ? null :
                cb.greaterThanOrEqualTo(root.get("harvestedAt"), from);
    }

    public static Specification<Crop> harvestedAtTo(LocalDate to) {
        return (root, query, cb) ->
                to == null ? null :
                cb.lessThanOrEqualTo(root.get("harvestedAt"), to);
    }
}
