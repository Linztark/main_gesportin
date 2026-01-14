package net.ausiasmarch.gesportin.entity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
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
    @Column(nullable = false)
    private String nombre;

    @NotNull
    @Column(name = "id_entrenador", nullable = false)
    private Long idEntrenador;

    @NotNull
    @Column(name = "id_categoria", nullable = false)
    private Long idCategoria;
    

    
}