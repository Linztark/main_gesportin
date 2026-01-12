package net.ausiasmarch.gesportin.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import net.ausiasmarch.gesportin.entity.EquipoEntity;

@Repository
public interface EquipoRepository extends JpaRepository<EquipoEntity, Long> {
    
}
