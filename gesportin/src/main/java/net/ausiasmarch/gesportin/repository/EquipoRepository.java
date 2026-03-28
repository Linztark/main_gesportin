package net.ausiasmarch.gesportin.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import net.ausiasmarch.gesportin.entity.EquipoEntity;

public interface EquipoRepository extends JpaRepository<EquipoEntity, Long> {

    Page<EquipoEntity> findByNombreContainingIgnoreCase(String nombre, Pageable pageable);

    Page<EquipoEntity> findByNombreContainingIgnoreCaseAndCategoriaTemporadaClubId(String nombre, Long clubId, Pageable pageable);

    Page<EquipoEntity> findByCategoriaId(Long idCategoria, Pageable pageable);

    Page<EquipoEntity> findByEntrenadorId(Long idEntrenador, Pageable pageable);

    // teams filtered by club of their category's temporada (used by equipo‑admin)
    Page<EquipoEntity> findByCategoriaTemporadaClubId(Long clubId, Pageable pageable);

    // Obtener una lista de todos los equipos de un club específico
    // mediante una select nativa
    @Query(value = """
                        SELECT e.* 
                        FROM equipo e, categoria c, temporada t
                        WHERE t.id_club=:id_club
                        AND c.id_temporada=t.id
                        AND e.id_categoria=c.id 
                        """, nativeQuery = true)
    List<EquipoEntity> getAllEquiposFromClub(Long id_club);
}
