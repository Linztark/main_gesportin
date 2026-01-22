package net.ausiasmarch.gesportin.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import net.ausiasmarch.gesportin.entity.TemporadaEntity;

public interface TemporadaRepository extends JpaRepository<TemporadaEntity, Long> {

    Page<TemporadaEntity> findByClubId(Long id_club, Pageable pageable);

    Page<TemporadaEntity> findByDescripcionContainingIgnoreCase(String descripcion, Pageable pageable);
}

