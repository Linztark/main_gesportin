package net.ausiasmarch.gesportin.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import net.ausiasmarch.gesportin.entity.TemporadaEntity;
import net.ausiasmarch.gesportin.exception.ResourceNotFoundException;
import net.ausiasmarch.gesportin.repository.TemporadaRepository;

@Service
public class TemporadaService {

    @Autowired
    private TemporadaRepository oTemporadaRepository;

    // ---------------------------- CRUD ----------------------------

    public TemporadaEntity get(Long id) {
        return oTemporadaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Temporada not found"));
    }

    public Long create(TemporadaEntity oTemporadaEntity) {
        oTemporadaRepository.save(oTemporadaEntity);
        return oTemporadaEntity.getId();
    }

    public Long update(TemporadaEntity oTemporadaEntity) {
        TemporadaEntity existing = oTemporadaRepository.findById(oTemporadaEntity.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Temporada not found"));

        existing.setDescripcion(oTemporadaEntity.getDescripcion());
        oTemporadaRepository.save(existing);

        return existing.getId();
    }

    public Long delete(Long id) {
        oTemporadaRepository.deleteById(id);
        return id;
    }

    public Page<TemporadaEntity> getPage(Pageable oPageable) {
        return oTemporadaRepository.findAll(oPageable);
    }

    public Long count() {
        return oTemporadaRepository.count();
    }

    // ---------------------------- EXTRA ----------------------------

    public Long fill(Long cantidad) {

        String[] nombres = {
            "Temporada 2019/2020",
            "Temporada 2020/2021",
            "Temporada 2021/2022",
            "Temporada 2022/2023",
            "Temporada 2023/2024",
            "Temporada Primavera",
            "Temporada Verano",
            "Temporada Otoño",
            "Temporada Invierno",
            "Temporada Especial",
            "Temporada Juvenil",
            "Temporada Senior"
        };

        for (long i = 0; i < cantidad; i++) {
            TemporadaEntity t = new TemporadaEntity();
            int indice = (int) (Math.random() * nombres.length);
            t.setDescripcion(nombres[indice]);
            oTemporadaRepository.save(t);
        }

        return oTemporadaRepository.count();
    }

    public Long empty() {
        Long total = oTemporadaRepository.count();
        oTemporadaRepository.deleteAll();
        return total;
    }
}



