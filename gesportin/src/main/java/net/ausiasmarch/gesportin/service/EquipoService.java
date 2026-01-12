package net.ausiasmarch.gesportin.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import net.ausiasmarch.gesportin.entity.EquipoEntity;
import net.ausiasmarch.gesportin.exception.ResourceNotFoundException;
import net.ausiasmarch.gesportin.exception.UnauthorizedException;
import net.ausiasmarch.gesportin.repository.EquipoRepository;

@Service
public class EquipoService {

    @Autowired
    EquipoRepository equipoRepository;

    @Autowired
    SessionService sessionService;

    @Autowired
    AleatorioService aleatorioService;

    public EquipoEntity get(Long id) {
        if (!sessionService.isSessionActive()) {
            throw new UnauthorizedException("No active session");
        }
        return equipoRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Equipo not found"));
    }

    public Long create(EquipoEntity equipoEntity) {
        if (!sessionService.isSessionActive()) {
            throw new UnauthorizedException("No active session");
        }
        equipoEntity.setId(null);
        return equipoRepository.save(equipoEntity).getId();
    }

    public Long update(EquipoEntity equipoEntity) {
        if (!sessionService.isSessionActive()) {
            throw new UnauthorizedException("No active session");
        }
        EquipoEntity oEquipoEntity = equipoRepository.findById(equipoEntity.getId()).orElseThrow(() -> new ResourceNotFoundException("Equipo not found"));
        oEquipoEntity.setNombre(equipoEntity.getNombre());
        oEquipoEntity.setId_club(equipoEntity.getId_club());
        oEquipoEntity.setId_entrenador(equipoEntity.getId_entrenador());
        oEquipoEntity.setId_categoria(equipoEntity.getId_categoria());
        oEquipoEntity.setId_liga(equipoEntity.getId_liga());
        oEquipoEntity.setId_temporada(equipoEntity.getId_temporada());
        return equipoRepository.save(oEquipoEntity).getId();
    }

    public Long delete(Long id) {
        if (!sessionService.isSessionActive()) {
            throw new UnauthorizedException("No active session");
        }
        if (!equipoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Equipo not found");
        }
        equipoRepository.deleteById(id);
        return id;
    }

    public Long count() {
        return equipoRepository.count();
    }

    public Long empty() {
        if (!sessionService.isSessionActive()) {
            throw new UnauthorizedException("No active session");
        }
        Long i = equipoRepository.count();
        equipoRepository.deleteAll();
        return i;
    }

    public Long fill(Long cantidad) {
        if (!sessionService.isSessionActive()) {
            throw new UnauthorizedException("No active session");
        }
        for (int i = 0; i < cantidad; i++) {
            EquipoEntity equipoEntity = new EquipoEntity();
            equipoEntity.setNombre("Equipo " + i);
            equipoEntity.setId_club((long) aleatorioService.GenerarNumeroAleatorioEnteroEnRango(1, 50));
            equipoEntity.setId_entrenador((long) aleatorioService.GenerarNumeroAleatorioEnteroEnRango(1, 50));
            equipoEntity.setId_categoria((long) aleatorioService.GenerarNumeroAleatorioEnteroEnRango(1, 50));
            equipoEntity.setId_liga((long) aleatorioService.GenerarNumeroAleatorioEnteroEnRango(1, 50));
            equipoEntity.setId_temporada((long) aleatorioService.GenerarNumeroAleatorioEnteroEnRango(1, 50));
            equipoRepository.save(equipoEntity);
        }
        return count();
    }
}