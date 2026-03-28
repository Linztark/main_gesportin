package net.ausiasmarch.gesportin.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import net.ausiasmarch.gesportin.entity.PuntuacionEntity;
import net.ausiasmarch.gesportin.exception.ResourceNotFoundException;
import net.ausiasmarch.gesportin.exception.UnauthorizedException;
import net.ausiasmarch.gesportin.repository.PuntuacionRepository;

@Service
public class PuntuacionService {

    @Autowired
    private PuntuacionRepository oPuntuacionRepository;

    @Autowired
    private AleatorioService oAleatorioService;

    @Autowired
    private NoticiaService oNoticiaService;

    @Autowired
    private UsuarioService oUsuarioService;

    @Autowired
    private SessionService oSessionService;

    public PuntuacionEntity get(Long id) {
        PuntuacionEntity e = oPuntuacionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Puntuación no encontrado con id: " + id));
        if (oSessionService.isEquipoAdmin() || oSessionService.isUsuario()) {
            Long clubId = e.getNoticia().getClub().getId();
            oSessionService.checkSameClub(clubId);
        }
        return e;
    }

    public Page<PuntuacionEntity> getPage(Pageable pageable, Long id_noticia, Long id_usuario) {
        if (oSessionService.isEquipoAdmin() || oSessionService.isUsuario()) {
            Long myClub = oSessionService.getIdClub();
            if (id_noticia != null) {
                Long clubNot = oNoticiaService.get(id_noticia).getClub().getId();
                if (!myClub.equals(clubNot)) {
                    throw new UnauthorizedException("Acceso denegado: solo puntuaciones de su club");
                }
            }
            if (id_usuario != null) {
                // regular users can only query their own puntuaciones
                if (oSessionService.isUsuario() && !id_usuario.equals(oSessionService.getIdUsuario())) {
                    throw new UnauthorizedException("Acceso denegado: solo puede ver sus propias puntuaciones");
                }
                Long clubUsr = oUsuarioService.get(id_usuario).getClub().getId();
                if (!myClub.equals(clubUsr)) {
                    throw new UnauthorizedException("Acceso denegado: solo puntuaciones de su club");
                }
            }
            if (id_noticia == null && id_usuario == null) {
                return oPuntuacionRepository.findByNoticiaClubId(myClub, pageable);
            }
        }
        if (id_noticia != null) {
            return oPuntuacionRepository.findByNoticiaId(id_noticia, pageable);
        } else if (id_usuario != null) {
            return oPuntuacionRepository.findByUsuarioId(id_usuario, pageable);
        } else {
            return oPuntuacionRepository.findAll(pageable);
        }
    }

    public PuntuacionEntity create(PuntuacionEntity oPuntuacionEntity) {
        if (oSessionService.isEquipoAdmin()) {
            throw new UnauthorizedException("Acceso denegado: no puede gestionar puntuaciones");
        }
        // Ensure the noticia exists and belongs to the user's club
        var noticia = oNoticiaService.get(oPuntuacionEntity.getNoticia().getId());
        if (oSessionService.isUsuario()) {
            Long currentUserId = oSessionService.getIdUsuario();
            oPuntuacionEntity.setUsuario(oUsuarioService.get(currentUserId));
            oSessionService.checkSameClub(noticia.getClub().getId());
        } else {
            oPuntuacionEntity.setUsuario(oUsuarioService.get(oPuntuacionEntity.getUsuario().getId()));
        }
        oPuntuacionEntity.setId(null); 
        oPuntuacionEntity.setNoticia(noticia);
        return oPuntuacionRepository.save(oPuntuacionEntity);
    }

    public PuntuacionEntity update(PuntuacionEntity oPuntuacionEntity) {
        if (oSessionService.isEquipoAdmin()) {
            throw new UnauthorizedException("Acceso denegado: no puede gestionar puntuaciones");
        }
        PuntuacionEntity oPuntuacionExistente = oPuntuacionRepository.findById(oPuntuacionEntity.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Puntuación no encontrado con id: " + oPuntuacionEntity.getId()));
        if (oSessionService.isUsuario()) {
            Long currentUserId = oSessionService.getIdUsuario();
            if (!currentUserId.equals(oPuntuacionExistente.getUsuario().getId())) {
                throw new UnauthorizedException("Acceso denegado: solo puede modificar sus propias puntuaciones");
            }
            oSessionService.checkSameClub(oPuntuacionExistente.getNoticia().getClub().getId());
            oPuntuacionExistente.setUsuario(oUsuarioService.get(currentUserId));
        } else {
            oPuntuacionExistente.setUsuario(oUsuarioService.get(oPuntuacionEntity.getUsuario().getId()));
        }

        oPuntuacionExistente.setPuntuacion(oPuntuacionEntity.getPuntuacion());
        oPuntuacionExistente.setNoticia(oNoticiaService.get(oPuntuacionEntity.getNoticia().getId()));
        return oPuntuacionRepository.save(oPuntuacionExistente);
    }

    public Long delete(Long id) {
        if (oSessionService.isEquipoAdmin()) {
            throw new UnauthorizedException("Acceso denegado: no puede gestionar puntuaciones");
        }
        PuntuacionEntity oPuntuacion = oPuntuacionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Puntuación no encontrado con id: " + id));
        if (oSessionService.isUsuario()) {
            Long currentUserId = oSessionService.getIdUsuario();
            if (!currentUserId.equals(oPuntuacion.getUsuario().getId())) {
                throw new UnauthorizedException("Acceso denegado: solo puede borrar sus propias puntuaciones");
            }
            oSessionService.checkSameClub(oPuntuacion.getNoticia().getClub().getId());
        }
        oPuntuacionRepository.delete(oPuntuacion);
        return id;
    }

    public Long count() {
        return oPuntuacionRepository.count();
    }

    public Long empty() {
        oSessionService.requireAdmin();
        oPuntuacionRepository.deleteAll();
        oPuntuacionRepository.flush();
        return 0L;
    }

    public Long fill(Long cantidad) {
        oSessionService.requireAdmin();
        for (int i = 0; i < cantidad; i++) {
            PuntuacionEntity oPuntuacion = new PuntuacionEntity();
            oPuntuacion.setPuntuacion(oAleatorioService.generarNumeroAleatorioEnteroEnRango(1, 5));
            oPuntuacion.setNoticia(oNoticiaService.getOneRandom());
            oPuntuacion.setUsuario(oUsuarioService.getOneRandom());
            oPuntuacionRepository.save(oPuntuacion);
        }
        return cantidad;
    }
}
