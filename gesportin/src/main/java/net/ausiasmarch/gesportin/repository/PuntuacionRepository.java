package net.ausiasmarch.gesportin.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import net.ausiasmarch.gesportin.entity.PuntuacionEntity;

public interface PuntuacionRepository extends JpaRepository<PuntuacionEntity, Long> {

    Page<PuntuacionEntity> findByNoticiaId(Long id_noticia, Pageable pageable);

    Page<PuntuacionEntity> findByUsuarioId(Long id_usuario, Pageable pageable);
}
