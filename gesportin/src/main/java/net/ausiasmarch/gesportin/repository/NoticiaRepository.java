package net.ausiasmarch.gesportin.repository;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import net.ausiasmarch.gesportin.entity.NoticiaEntity;

public interface NoticiaRepository extends JpaRepository<NoticiaEntity, Long> {

    Page<NoticiaEntity> findByClubId(Long idClub, Pageable pageable);

    Page<NoticiaEntity> findByTituloContainingIgnoreCaseOrContenidoContainingIgnoreCase(String titulo, String contenido, Pageable pageable);

    @org.springframework.data.jpa.repository.Query("SELECT n FROM NoticiaEntity n WHERE n.club.id = :clubId AND (LOWER(n.titulo) LIKE LOWER(CONCAT('%', :texto, '%')) OR LOWER(n.contenido) LIKE LOWER(CONCAT('%', :texto, '%')))")
    Page<NoticiaEntity> findByClubIdAndTextoContainingIgnoreCase(@org.springframework.data.repository.query.Param("clubId") Long clubId, @org.springframework.data.repository.query.Param("texto") String texto, Pageable pageable);

}
