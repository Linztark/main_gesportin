package net.ausiasmarch.gesportin.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import net.ausiasmarch.gesportin.entity.TipousuarioEntity;
import net.ausiasmarch.gesportin.exception.ResourceNotFoundException;
import net.ausiasmarch.gesportin.repository.TipousuarioRepository;

@Service
public class TipousuarioService {

    @Autowired
    TipousuarioRepository tipousuarioRepository;

    private static final String[] TIPOS = {
        "Administrador", "Administrador de equipo", "Usuario"
    };

    public TipousuarioEntity get(Long id) {
        return tipousuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tipousuario no encontrado con id: " + id));
    }

    public List<TipousuarioEntity> getAll() {
        return tipousuarioRepository.findAll();
    }

    public Long empty() {
        tipousuarioRepository.deleteAll();
        tipousuarioRepository.flush();
        return 0L;
    }

    public Long count() {
        return tipousuarioRepository.count();
    }

    public Long fill() {
        for (int i = 0; i < TIPOS.length; i++) {
            TipousuarioEntity tipousuario = new TipousuarioEntity();
            tipousuario.setDescripcion(TIPOS[i % TIPOS.length]);
            tipousuarioRepository.save(tipousuario);
        }
        return this.count();
    }

    public TipousuarioEntity getOneRandom() {
        Long count = tipousuarioRepository.count();
        if (count == 0) {
            return null;
        }
        int index = (int) (Math.random() * count);
        return tipousuarioRepository.findAll(org.springframework.data.domain.Pageable.ofSize(1).withPage(index)).getContent().get(0);
    }

}
