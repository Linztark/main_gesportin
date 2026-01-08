package net.ausiasmarch.gesportin.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;

import jakarta.validation.constraints.NotNull;
import net.ausiasmarch.gesportin.entity.PuntuacionEntity;
import net.ausiasmarch.gesportin.exception.ResourceNotFoundException;
import net.ausiasmarch.gesportin.repository.PuntuacionRepository;

public class PuntuacionService {

    @Autowired
    PuntuacionRepository oPuntuacionRepository;

    @Autowired
    AleatorioService oAleatorioService;

    // @Autowired
    // SessionService

    // constructor
    public PuntuacionService() {

    }

    // GET page
    public Page<PuntuacionEntity> getPage(@NotNull Pageable oPageable) {
        return oPuntuacionRepository.findAll(oPageable);
    }

    // GET by id
    public PuntuacionEntity get(@NotNull Long id) {
        return oPuntuacionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("The record not found in DB."));
    }

    // POST
    public Long create(PuntuacionEntity oPuntuacionEntity) {
        // oPuntuacionRepository.save();
        return oPuntuacionEntity.getId();
    }
}
