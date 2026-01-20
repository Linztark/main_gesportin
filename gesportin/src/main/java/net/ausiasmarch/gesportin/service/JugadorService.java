package net.ausiasmarch.gesportin.service;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import net.ausiasmarch.gesportin.entity.JugadorEntity;
import net.ausiasmarch.gesportin.exception.ResourceNotFoundException;
import net.ausiasmarch.gesportin.repository.JugadorRepository;

@Service
public class JugadorService {

    @Autowired
    private JugadorRepository oJugadorRepository;

    @Autowired
    private AleatorioService oAleatorioService;

    @Autowired
    private UsuarioService oUsuarioService;

    @Autowired
    private EquipoService oEquipoService;

    ArrayList<String> posiciones = new ArrayList<>();

    public JugadorService() {
        posiciones.add("Portero");
        posiciones.add("Defensa central");
        posiciones.add("Lateral derecho");
        posiciones.add("Lateral izquierdo");
        posiciones.add("Centrocampista defensivo");
        posiciones.add("Centrocampista");
        posiciones.add("Centrocampista ofensivo");
        posiciones.add("Extremo derecho");
        posiciones.add("Extremo izquierdo");
        posiciones.add("Delantero centro");
    }

    public JugadorEntity get(Long id) {
        return oJugadorRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Jugador no encontrado con id: " + id));
    }

    public Page<JugadorEntity> getPage(Pageable pageable) {
        return oJugadorRepository.findAll(pageable);
    }

    public JugadorEntity create(JugadorEntity oJugadorEntity) {
        oJugadorEntity.setId(null);
        oJugadorEntity.setEquipo(oEquipoService.get(oJugadorEntity.getEquipo().getId()));
        oJugadorEntity.setUsuario(oUsuarioService.get(oJugadorEntity.getUsuario().getId()));

        return oJugadorRepository.save(oJugadorEntity);
    }

    public JugadorEntity update(JugadorEntity oJugadorEntity) {
        JugadorEntity oJugadorExistente = oJugadorRepository.findById(oJugadorEntity.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Jugador no encontrado con id: " + oJugadorEntity.getId()));
        oJugadorExistente.setDorsal(oJugadorEntity.getDorsal());
        oJugadorExistente.setPosicion(oJugadorEntity.getPosicion());
        oJugadorExistente.setCapitan(oJugadorEntity.getCapitan());
        oJugadorExistente.setImagen(oJugadorEntity.getImagen());
        oJugadorExistente.setUsuario(oUsuarioService.get(oJugadorEntity.getUsuario().getId()));
        oJugadorExistente.setEquipo(oEquipoService.get(oJugadorEntity.getEquipo().getId()));
        return oJugadorRepository.save(oJugadorExistente);
    }

    public Long delete(Long id) {
        JugadorEntity oJugador = oJugadorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Jugador no encontrado con id: " + id));
        oJugadorRepository.delete(oJugador);
        return id;
    }

    public Long empty() {
        oJugadorRepository.deleteAll();
        oJugadorRepository.flush();
        return 0L;
    }

    public Long count() {
        return oJugadorRepository.count();
    }

    public Long fill(Long cantidad) {
        for (long j = 0; j < cantidad; j++) {
            JugadorEntity jugador = new JugadorEntity();
            jugador.setDorsal(oAleatorioService.generarNumeroAleatorioEnteroEnRango(1, 99));
            jugador.setPosicion(posiciones.get(oAleatorioService.generarNumeroAleatorioEnteroEnRango(0, posiciones.size() - 1)));
            jugador.setCapitan(oAleatorioService.generarNumeroAleatorioEnteroEnRango(0, 1) == 1);
            jugador.setImagen(null);
            jugador.setUsuario(oUsuarioService.getOneRandom());
            jugador.setEquipo(oEquipoService.getOneRandom());
            oJugadorRepository.save(jugador);
        }
        return cantidad;
    }

    public JugadorEntity getOneRandom() {
        Long count = oJugadorRepository.count();
        if (count == 0) {
            return null;
        }
        int index = (int) (Math.random() * count);
        return oJugadorRepository.findAll(Pageable.ofSize(1).withPage(index)).getContent().get(0);
    }
}
