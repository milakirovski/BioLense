package mk.ukim.finki.uikt.biolense.backendbiolense.config;

import mk.ukim.finki.uikt.biolense.backendbiolense.models.Crop;
import mk.ukim.finki.uikt.biolense.backendbiolense.models.Diagnosis;
import mk.ukim.finki.uikt.biolense.backendbiolense.models.User;
import mk.ukim.finki.uikt.biolense.backendbiolense.models.enumerations.CropStatus;
import mk.ukim.finki.uikt.biolense.backendbiolense.models.enumerations.UserRole;
import mk.ukim.finki.uikt.biolense.backendbiolense.repositories.CropRepository;
import mk.ukim.finki.uikt.biolense.backendbiolense.repositories.DiagnosisRepository;
import mk.ukim.finki.uikt.biolense.backendbiolense.repositories.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;

import java.math.BigDecimal;
import java.time.LocalDate;

@Component
public class DataInitializer {

    private final UserRepository userRepository;
    private final CropRepository cropRepository;
    private final DiagnosisRepository diagnosisRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, CropRepository cropRepository,
                           DiagnosisRepository diagnosisRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.cropRepository = cropRepository;
        this.diagnosisRepository = diagnosisRepository;
        this.passwordEncoder = passwordEncoder;
    }


    @PostConstruct
    public void init(){

         // --- Users ---
        User admin = new User(
                "admin@biolense.mk",
                passwordEncoder.encode("Admin@123"),
                "Ana", "Kovachevska",
                "BioLense Admin",
                UserRole.ADMIN
        );
        userRepository.save(admin);

//        User farmer1 = new User(
//                "petar.petrov@farm.mk",
//                passwordEncoder.encode("Farmer@123"),
//                "Petar", "Petrov",
//                "Petrov Family Farm",
//                UserRole.FARMER
//        );
//        userRepository.save(farmer1);
//
//        User farmer2 = new User(
//                "elena.stojanovic@farm.mk",
//                passwordEncoder.encode("Farmer@123"),
//                "Elena", "Stojanovic",
//                "Stojanovic Organics",
//                UserRole.FARMER
//        );
//        userRepository.save(farmer2);
//
//        // --- Crops for farmer1 ---
//        Crop wheat = new Crop(
//                farmer1,
//                "Wheat",
//                "North Field",
//                new BigDecimal("12.50"),
//                LocalDate.of(2025, 10, 5),
//                LocalDate.of(2026, 7, 10)
//        );
//        wheat.setNotes("Winter wheat variety. Fertilizer applied in November.");
//        cropRepository.save(wheat);
//
//        Crop sunflower = new Crop(
//                farmer1,
//                "Sunflower",
//                "South Field",
//                new BigDecimal("8.00"),
//                LocalDate.of(2025, 5, 1),
//                LocalDate.of(2025, 9, 15)
//        );
//        sunflower.setStatus(CropStatus.HARVESTED);
//        sunflower.setHarvestedAt(LocalDate.of(2025, 9, 20));
//        sunflower.setYieldKgPerHa(new BigDecimal("2350.00"));
//        sunflower.setNotes("Good yield despite dry August.");
//        cropRepository.save(sunflower);
//
//        Crop corn = new Crop(
//                farmer1,
//                "Corn",
//                "West Field",
//                new BigDecimal("5.75"),
//                LocalDate.of(2025, 4, 20),
//                LocalDate.of(2025, 9, 30)
//        );
//        corn.setStatus(CropStatus.ACTIVE);
//        corn.setNotes("Crop lost to pest damage. Filed insurance claim.");
//        cropRepository.save(corn);
//
//        // --- Crops for farmer2 ---
//        Crop tomato = new Crop(
//                farmer2,
//                "Tomato",
//                "Greenhouse A",
//                new BigDecimal("0.80"),
//                LocalDate.of(2026, 3, 1),
//                LocalDate.of(2026, 7, 1)
//        );
//        tomato.setNotes("Cherry tomato variety. Drip irrigation installed.");
//        cropRepository.save(tomato);
//
//        Crop pepper = new Crop(
//                farmer2,
//                "Red Pepper",
//                "Greenhouse B",
//                new BigDecimal("0.60"),
//                LocalDate.of(2026, 3, 10),
//                LocalDate.of(2026, 7, 15)
//        );
//        cropRepository.save(pepper);
//
//        Crop potato = new Crop(
//                farmer2,
//                "Potato",
//                "East Field",
//                new BigDecimal("3.20"),
//                LocalDate.of(2025, 4, 10),
//                LocalDate.of(2025, 8, 20)
//        );
//        potato.setStatus(CropStatus.HARVESTED);
//        potato.setHarvestedAt(LocalDate.of(2025, 8, 25));
//        potato.setYieldKgPerHa(new BigDecimal("28000.00"));
//        cropRepository.save(potato);
//
//        // --- Diagnoses ---
//        diagnosisRepository.save(new Diagnosis(
//                wheat, "Wheat", "Wheat Rust",
//                0.92, false, "Apply fungicide (propiconazole) at 250 ml/ha"
//        ));
//
//        diagnosisRepository.save(new Diagnosis(
//                corn, "Corn", "Fall Armyworm",
//                0.87, false, "Apply insecticide (chlorantraniliprole). Scout fields weekly."
//        ));
//
//        diagnosisRepository.save(new Diagnosis(
//                tomato, "Tomato", "Early Blight",
//                0.95, false, "Remove affected leaves. Apply copper-based fungicide."
//        ));
//
//        diagnosisRepository.save(new Diagnosis(
//                tomato, "Tomato", null,
//                null, true, null
//        ));
//
//        diagnosisRepository.save(new Diagnosis(
//                pepper, "Red Pepper", "Bacterial Leaf Spot",
//                0.78, false, "Apply copper hydroxide spray. Avoid overhead irrigation."
//        ));

    }
}