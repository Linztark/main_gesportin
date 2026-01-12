package net.ausiasmarch.gesportin.entity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "equipo")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EquipoEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotNull
    @Size(min = 3, max = 1024)
    private String nombre;
    
    @NotNull
    private Long id_club;

     @NotNull
    private Long id_entrenador;

     @NotNull
    private Long id_categoria;

     @NotNull
    private Long id_liga;

     @NotNull
    private Long id_temporada;
    

    
}