package net.ausiasmarch.gesportin.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import net.ausiasmarch.gesportin.entity.RolusuarioEntity;

public interface RolusuarioRepository extends JpaRepository<RolusuarioEntity, Long> {
    

    Page<RolusuarioEntity> findByDescripcionContainingIgnoreCase(String descripcion, Pageable pageable);    


}
