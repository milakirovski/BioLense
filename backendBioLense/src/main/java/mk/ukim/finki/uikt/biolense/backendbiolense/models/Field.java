package mk.ukim.finki.uikt.biolense.backendbiolense.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "fields")
@Getter
@Setter
public class Field {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String description;

    @ManyToOne
    private Crop plantedCrop;

    @JsonIgnore
    @ManyToOne
    private User owner;

}