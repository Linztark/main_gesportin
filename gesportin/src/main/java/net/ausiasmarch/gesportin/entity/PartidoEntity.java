package net.ausiasmarch.gesportin.entity;

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
@Table(name = "partido")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PartidoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @NotNull
    @Size(min = 3, max = 1024)
    private String nombre_rival;

    @NotNull
    private long id_equipo;

    @NotNull
    private Boolean local;

    @NotNull
    @Size(min = 3, max = 1024)
    private String resultado;
    
}
