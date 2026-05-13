package mk.ukim.finki.uikt.biolense.backendbiolense.service.application.impl;

import mk.ukim.finki.uikt.biolense.backendbiolense.models.Field;
import mk.ukim.finki.uikt.biolense.backendbiolense.models.User;
import mk.ukim.finki.uikt.biolense.backendbiolense.repositories.FieldRepository;
import mk.ukim.finki.uikt.biolense.backendbiolense.service.application.FieldApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FieldApplicationServiceImpl implements FieldApplicationService {

    private final FieldRepository fieldRepository;

    @Autowired
    public FieldApplicationServiceImpl(FieldRepository fieldRepository) {
        this.fieldRepository = fieldRepository;
    }

    @Override
    public List<Field> getAllFields(User user) {
        return fieldRepository.findFieldsByOwner(user.getId());
    }

    @Override
    public Field getFieldById(Long id) {
        return fieldRepository.findById(id).orElse(null);
    }

    @Override
    public Field createField(Field field) {
        return fieldRepository.save(field);
    }

    @Override
    public Field updateField(Long id, Field updatedField) {
        return fieldRepository.findById(id).map(field -> {
            field.setName(updatedField.getName());
            field.setDescription(updatedField.getDescription());
            field.setPlantedCrop(updatedField.getPlantedCrop());
            return fieldRepository.save(field);
        }).orElse(null);
    }

    @Override
    public void deleteField(Long id) {
        fieldRepository.deleteById(id);
    }

}
