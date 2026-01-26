package net.ausiasmarch.gesportin.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import net.ausiasmarch.gesportin.entity.ComentarioEntity;

public interface ComentarioRepository extends JpaRepository<ComentarioEntity, Long> {
    Page<ComentarioEntity> findByContenidoContainingIgnoreCase(String contenido, Pageable pageable);
    Page<ComentarioEntity> findByUsuarioId(Long id_usuario, Pageable pageable);
    Page<ComentarioEntity> findByNoticiaId(Long id_noticia, Pageable pageable);

}
