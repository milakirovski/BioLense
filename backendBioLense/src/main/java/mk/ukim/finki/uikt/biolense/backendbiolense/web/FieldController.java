package mk.ukim.finki.uikt.biolense.backendbiolense.web;

import mk.ukim.finki.uikt.biolense.backendbiolense.models.Field;
import mk.ukim.finki.uikt.biolense.backendbiolense.models.User;
import mk.ukim.finki.uikt.biolense.backendbiolense.service.application.FieldApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fields")

public class FieldController {
    private final FieldApplicationService fieldService;

    @Autowired
    public FieldController(FieldApplicationService fieldService) {
        this.fieldService = fieldService;
    }

    @GetMapping
    public List<Field> getAllFields(@AuthenticationPrincipal User user) {
        return fieldService.getAllFields(user);
    }

    @GetMapping("/{id}")
    public Field getFieldById(@PathVariable Long id) {
        return fieldService.getFieldById(id);
    }

    @PostMapping
    public Field createField(@RequestBody Field field, @AuthenticationPrincipal User user) {
        field.setOwner(user);
        return fieldService.createField(field);
    }

    @PutMapping("/{id}")
    public Field updateField(@PathVariable Long id, @RequestBody Field field) {
        return fieldService.updateField(id, field);
    }

    @DeleteMapping("/{id}")
    public void deleteField(@PathVariable Long id) {
        fieldService.deleteField(id);
    }

}
