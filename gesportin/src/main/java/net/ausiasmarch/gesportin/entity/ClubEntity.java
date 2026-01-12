package net.ausiasmarch.gesportin.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "club")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClubEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(name = "dirección", nullable = false)
    private String direccion;

    @Column(name = "teléfono", nullable = false)
    private String telefono;

    @Column(name = "fecha_alta", nullable = false)
    private LocalDateTime fechaAlta;

    @Column(name = "id_presidente", nullable = false)
    private Long idPresidente;

    @Column(name = "id_vicepresidente", nullable = false)
    private Long idVicepresidente;

    @Lob
    @Column(nullable = false)
    private byte[] imagen;
}
