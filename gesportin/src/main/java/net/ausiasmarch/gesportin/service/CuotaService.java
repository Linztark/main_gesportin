package net.ausiasmarch.gesportin.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import net.ausiasmarch.gesportin.entity.CuotaEntity;
import net.ausiasmarch.gesportin.exception.ResourceNotFoundException;
import net.ausiasmarch.gesportin.exception.UnauthorizedException;
import net.ausiasmarch.gesportin.repository.CuotaRepository;

@Service
public class CuotaService {

    @Autowired
    private CuotaRepository oCuotaRepository;

    @Autowired
    private EquipoService oEquipoService;

    @Autowired
    private SessionService oSessionService;

    public CuotaEntity get(Long id) {
        CuotaEntity e = oCuotaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cuota no encontrado con id: " + id));
        if (oSessionService.isEquipoAdmin() || oSessionService.isUsuario()) {
            Long clubId = e.getEquipo().getCategoria().getTemporada().getClub().getId();
            oSessionService.checkSameClub(clubId);
        }
        return e;
    }

    public Page<CuotaEntity> getPage(Pageable pageable, String descripcion, Long id_equipo) {
        if (oSessionService.isEquipoAdmin() || oSessionService.isUsuario()) {
            Long myClub = oSessionService.getIdClub();
            if (id_equipo != null) {
                Long clubEq = oEquipoService.get(id_equipo).getCategoria().getTemporada().getClub().getId();
                if (!myClub.equals(clubEq)) {
                    throw new UnauthorizedException("Acceso denegado: solo cuotas de su club");
                }
            }
            if ((descripcion == null || descripcion.isEmpty()) && id_equipo == null) {
                return oCuotaRepository.findByEquipoCategoriaTemporadaClubId(myClub, pageable);
            }
        }
        if (descripcion != null && !descripcion.isEmpty()) {
            return oCuotaRepository.findByDescripcionContainingIgnoreCase(descripcion, pageable);
        } else if (id_equipo != null) {
            return oCuotaRepository.findByEquipoId(id_equipo, pageable);
        } else {
            return oCuotaRepository.findAll(pageable);
        }
    }

    public CuotaEntity create(CuotaEntity oCuotaEntity) {
        // regular usuarios cannot create cuotas
        oSessionService.denyUsuario();
        if (oSessionService.isEquipoAdmin()) {
            Long clubId = oEquipoService.get(oCuotaEntity.getEquipo().getId())
                    .getCategoria().getTemporada().getClub().getId();
            oSessionService.checkSameClub(clubId);
        }
        oCuotaEntity.setId(null);
        oCuotaEntity.setFecha(LocalDateTime.now());
        oCuotaEntity.setEquipo(oEquipoService.get(oCuotaEntity.getEquipo().getId()));
        return oCuotaRepository.save(oCuotaEntity);
    }

    public CuotaEntity update(CuotaEntity oCuotaEntity) {
        // regular usuarios cannot modify cuotas
        oSessionService.denyUsuario();
        CuotaEntity oCuotaExistente = oCuotaRepository.findById(oCuotaEntity.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Cuota no encontrado con id: " + oCuotaEntity.getId()));
        if (oSessionService.isEquipoAdmin()) {
            Long clubOld = oCuotaExistente.getEquipo().getCategoria().getTemporada().getClub().getId();
            Long clubNew = oEquipoService.get(oCuotaEntity.getEquipo().getId())
                    .getCategoria().getTemporada().getClub().getId();
            oSessionService.checkSameClub(clubOld);
            oSessionService.checkSameClub(clubNew);
        }
        oCuotaExistente.setDescripcion(oCuotaEntity.getDescripcion());
        oCuotaExistente.setCantidad(oCuotaEntity.getCantidad());
        oCuotaExistente.setFecha(oCuotaEntity.getFecha());
        oCuotaExistente.setEquipo(oEquipoService.get(oCuotaEntity.getEquipo().getId()));
        return oCuotaRepository.save(oCuotaExistente);
    }

    public Long delete(Long id) {
        // regular usuarios cannot delete cuotas
        oSessionService.denyUsuario();
        CuotaEntity oCuota = oCuotaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cuota no encontrado con id: " + id));
        if (oSessionService.isEquipoAdmin()) {
            Long clubId = oCuota.getEquipo().getCategoria().getTemporada().getClub().getId();
            oSessionService.checkSameClub(clubId);
        }
        oCuotaRepository.delete(oCuota);
        return id;
    }

    public Long count() {
        if (oSessionService.isEquipoAdmin()) {
            Long myClub = oSessionService.getIdClub();
            if (myClub == null) return 0L;
            return oCuotaRepository.findByEquipoCategoriaTemporadaClubId(myClub, Pageable.ofSize(1)).getTotalElements();
        }
        return oCuotaRepository.count();
    }

    public Long empty() {
        oSessionService.requireAdmin();
        oCuotaRepository.deleteAll();
        oCuotaRepository.flush();
        return 0L;
    }

    public Long fill(Long cantidad) {
        oSessionService.requireAdmin();

        Random random = new Random();

        String[] nombres = {"Matrícula", "Mensualidad", "Cuota Extra", "Inscripción", "Cuota", "Pago", "Abono", "Loteria"};

        for (int i = 0; i < cantidad; i++) {
            CuotaEntity oCuota = new CuotaEntity();
            LocalDateTime fecha = LocalDateTime.now().minusDays(random.nextInt(365 * 5));
            // el mes en español
            oCuota.setDescripcion(nombres[random.nextInt(nombres.length)] + " " + fecha.getMonth().toString().toLowerCase() + " " + fecha.getYear());
            oCuota.setCantidad(BigDecimal.valueOf(random.nextDouble() * 100.0 + 1.0));
            oCuota.setFecha(fecha);
            oCuota.setEquipo(oEquipoService.getOneRandom());
            oCuotaRepository.save(oCuota);
        }

        return cantidad;
    }

    public CuotaEntity getOneRandom() {
        Long count = oCuotaRepository.count();
        if (count == 0) {
            return null;
        }
        int index = (int) (Math.random() * count);
        return oCuotaRepository.findAll(Pageable.ofSize(1).withPage(index)).getContent().get(0);
    }

}
