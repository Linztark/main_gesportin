package net.ausiasmarch.gesportin.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import net.ausiasmarch.gesportin.entity.PagoEntity;


public interface PagoRepository extends JpaRepository<PagoEntity, Long> {
    
    Page<PagoEntity> findByAbonadoTrue(Pageable oPageable);

    Page<PagoEntity> findByAbonadoFalse(Pageable oPageable);

    PagoEntity findByIdAndAbonadoTrue(Long id);
}
