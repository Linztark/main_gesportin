package net.ausiasmarch.gesportin.service;

import java.time.LocalDateTime;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import net.ausiasmarch.gesportin.entity.ClubEntity;
import net.ausiasmarch.gesportin.exception.ResourceNotFoundException;
import net.ausiasmarch.gesportin.repository.ClubRepository;

@Service
public class ClubService {

    @Autowired
    private ClubRepository oClubRepository;

    @Autowired
    private SessionService oSessionService;

    private final Random random = new Random();

    private final String[] descripciones1 = {
            "Atlético", "Deportivo", "Real club", "Unión deportiva",
            "Sociedad deportiva", "Socidad nacional", "Agrupación deportiva", "Club deportivo",
            "Asociación deportiva", "Federación deportiva", "Equipo deportivo", "Comunidad deportiva",
            "Círculo deportivo" };
    private final String[] descripciones2 = {
            "Fúbol", "Baloncesto", "Voleibol", "Hockey",
            "Rugby", "Tenis", "Natación", "Atletismo",
            "Ciclismo", "Boxeo", "Esgrima", "Gimnastia",
            "Piragüismo", "Remo", "Judo", "Taekwondo",
            "Karate", "Golf", "Surf", "Esquí" };
    private final String[] descripciones3 = {
            "Barcelona", "Madrid", "Valencia", "Sevilla",
            "Zaragoza", "Villarreal", "Granada", "Cádiz",
            "Bilbao", "San Sebastián", "Vigo", "La Coruña",
            "Mallorca", "Ibiza", "Tenerife", "Las Palmas" };
    private final String[] direcciones1 = {
            "Calle", "Avenida", "Plaza", "Camino", "Paseo", "Ronda", "Glorieta", "Travesía" };

    private final String[] nombres = { "Juan", "Carlos", "Luis", "Miguel", "Javier", "David", "Ángel", "Sergio",
            "Pablo", "Diego",
            "Manuel", "Francisco", "José", "Antonio", "Jesús", "Alberto", "Fernando", "Raúl", "Rubén", "Óscar" };

    private final String[] apellidos = { "García", "Martínez", "López", "Sánchez", "Pérez", "González", "Rodríguez",
            "Fernández",
            "Jiménez", "Moreno", "Muñoz", "Alonso", "Gutiérrez", "Romero", "Díaz", "Torres", "Ruiz", "Hernández",
            "Vázquez", "Castro" };

    public ClubEntity get(Long id) {
        // equipo administrators may only view their own club
        oSessionService.checkSameClub(id);
        return oClubRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Club no encontrado con id: " + id));
    }

    public Page<ClubEntity> getPage(Pageable pageable) {
        if (oSessionService.isEquipoAdmin() || oSessionService.isUsuario()) {
            Long myClub = oSessionService.getIdClub();
            if (myClub == null) {
                // should not happen, but just in case
                return org.springframework.data.domain.Page.empty(pageable);
            }
            // return a single-item page containing only the user's club
            ClubEntity club = oClubRepository.findById(myClub).orElse(null);
            if (club == null) {
                return org.springframework.data.domain.Page.empty(pageable);
            }
            java.util.List<ClubEntity> list = java.util.Collections.singletonList(club);
            return new org.springframework.data.domain.PageImpl<>(list, pageable, 1);
        }
        return oClubRepository.findAll(pageable);
    }

    public ClubEntity create(ClubEntity oClubEntity) {
        // equipo admins and regular usuarios are not allowed to create clubs
        oSessionService.denyEquipoAdmin();
        oSessionService.denyUsuario();
        oClubEntity.setId(null);
        oClubEntity.setFechaAlta(LocalDateTime.now());
        return oClubRepository.save(oClubEntity);
    }

    public ClubEntity update(ClubEntity oClubEntity) {
        // equipo admins and regular usuarios are not allowed to modify club data
        oSessionService.denyEquipoAdmin();
        oSessionService.denyUsuario();
        ClubEntity oClubExistente = oClubRepository.findById(oClubEntity.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Club no encontrado con id: " + oClubEntity.getId()));

        oClubExistente.setNombre(oClubEntity.getNombre());
        oClubExistente.setDireccion(oClubEntity.getDireccion());
        oClubExistente.setTelefono(oClubEntity.getTelefono());
        oClubExistente.setFechaAlta(oClubEntity.getFechaAlta());
        return oClubRepository.save(oClubExistente);
    }

    public Long delete(Long id) {
        // equipo admins and regular usuarios are not allowed to delete clubs
        oSessionService.denyEquipoAdmin();
        oSessionService.denyUsuario();
        ClubEntity oClub = oClubRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Club no encontrado con id: " + id));
        oClubRepository.delete(oClub);
        return id;
    }

    public Long count() {
        // equipo admins and regular usuarios should only be aware of their own club count
        if (oSessionService.isEquipoAdmin() || oSessionService.isUsuario()) {
            return (oSessionService.getIdClub() != null) ? 1L : 0L;
        }
        return oClubRepository.count();
    }

    public Long empty() {
        oSessionService.requireAdmin();
        oClubRepository.deleteAll();
        oClubRepository.flush();
        return 0L;
    }

    public Long fill(Long cantidad) {
        oSessionService.requireAdmin();
        for (int i = 0; i < cantidad; i++) {
            ClubEntity oClub = new ClubEntity();
            String nombre = descripciones1[random.nextInt(descripciones1.length)] + " de " +
                    descripciones2[random.nextInt(descripciones2.length)] + " en " +
                    descripciones3[random.nextInt(descripciones3.length)];
            oClub.setNombre(nombre);
            String direccion = direcciones1[random.nextInt(direcciones1.length)] + " de "
                    + nombres[random.nextInt(nombres.length)] + " " +
                    apellidos[random.nextInt(apellidos.length)] + ", " + (random.nextInt(100) + 1);
            oClub.setDireccion(direccion);
            oClub.setTelefono("6" + (random.nextInt(900000) + 1000000));
            oClub.setFechaAlta(LocalDateTime.now());
            // oClub.setImagen(("imagen" + i).getBytes());
            oClubRepository.save(oClub);
        }
        return cantidad;
    }

    public ClubEntity getOneRandom() {
        Long count = oClubRepository.count();
        if (count == 0) {
            return null;
        }
        int index = random.nextInt(count.intValue());
        return oClubRepository.findAll(Pageable.ofSize(1).withPage(index)).getContent().get(0);
    }
}
