package mk.ukim.finki.uikt.biolense.backendbiolense.service.application;

import mk.ukim.finki.uikt.biolense.backendbiolense.models.Field;
import mk.ukim.finki.uikt.biolense.backendbiolense.models.User;

import java.util.List;

public interface FieldApplicationService {

    List<Field> getAllFields(User user);
    Field getFieldById(Long id);
    Field createField(Field field);
    Field updateField(Long id, Field updatedField);
    void deleteField(Long id);

}
