package net.ausiasmarch.gesportin.entity;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "usuario")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String nombre;

    @NotBlank
    @Column(nullable = false)
    private String apellido1;

    @NotBlank
    @Column(nullable = false)
    private String apellido2;

    @NotBlank
    @Column(nullable = false, unique = true)
    private String username;

    @NotBlank
    @Column(nullable = false)
    private String password;

    @NotNull
    @Column(name = "fecha_alta", nullable = false)
    private LocalDateTime fechaAlta;

    @NotNull
    @Column(nullable = false)
    private Integer genero;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_tipousuario")
    private TipousuarioEntity tipousuario;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_club")
    private ClubEntity club;

    @OneToMany(mappedBy = "usuario", fetch = FetchType.LAZY)
    private List<ComentarioEntity> comentarios;

    @OneToMany(mappedBy = "usuario", fetch = FetchType.LAZY)
    private List<PuntuacionEntity> puntuaciones;

    @OneToMany(mappedBy = "usuario", fetch = FetchType.LAZY)
    private List<ClubEntity> presidencias;

    @OneToMany(mappedBy = "usuario", fetch = FetchType.LAZY)
    private List<ClubEntity> vicepresidencias;

    @OneToMany(mappedBy = "usuario", fetch = FetchType.LAZY)
    private List<ComentarioartEntity> comentarioarts;

    @OneToMany(mappedBy = "usuario", fetch = FetchType.LAZY)
    private List<CarritoEntity> carritos;

    @OneToMany(mappedBy = "usuario", fetch = FetchType.LAZY)
    private List<FacturaEntity> facturas;

}
