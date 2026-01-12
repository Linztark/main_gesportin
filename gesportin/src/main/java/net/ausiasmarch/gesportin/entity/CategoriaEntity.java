package net.ausiasmarch.gesportin.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name="categoria")
@Data
@NoArgsConstructor
public class CategoriaEntity {
    
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private long id;

    @NotNull
    @Size(min=4, max=255)
    private String nombre;
}
