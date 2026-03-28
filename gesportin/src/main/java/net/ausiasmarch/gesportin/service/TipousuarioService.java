package net.ausiasmarch.gesportin.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import net.ausiasmarch.gesportin.entity.TipousuarioEntity;
import net.ausiasmarch.gesportin.exception.ResourceNotFoundException;
import net.ausiasmarch.gesportin.exception.UnauthorizedException;
import net.ausiasmarch.gesportin.repository.TipousuarioRepository;

@Service
public class TipousuarioService {

    @Autowired
    TipousuarioRepository tipousuarioRepository;

    @Autowired
    SessionService oSessionService;

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
        oSessionService.requireAdmin();
        tipousuarioRepository.deleteAll();
        tipousuarioRepository.flush();
        return 0L;
    }

    public Long count() {
        return tipousuarioRepository.count();
    }

    public Long fill() {
        oSessionService.requireAdmin();
        for (int i = 0; i < TIPOS.length; i++) {
            TipousuarioEntity oTipousuario = new TipousuarioEntity();
            oTipousuario.setDescripcion(TIPOS[i % TIPOS.length]);
            tipousuarioRepository.save(oTipousuario);
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
