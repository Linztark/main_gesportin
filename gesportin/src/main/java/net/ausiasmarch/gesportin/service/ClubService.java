package net.ausiasmarch.gesportin.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import net.ausiasmarch.gesportin.entity.ClubEntity;
import net.ausiasmarch.gesportin.repository.ClubRepository;

@Service
public class ClubService {

    private final ClubRepository clubRepository;
    private final Random random = new Random();

    public ClubService(ClubRepository clubRepository) {
        this.clubRepository = clubRepository;
    }

    // GET
    public List<ClubEntity> getAll() {
        return clubRepository.findAll();
    }

    // GET BY ID
    public Optional<ClubEntity> getById(Long id) {
        return clubRepository.findById(id);
    }

    // GET PAGE
    public Page<ClubEntity> getPage(Pageable pageable) {
        return clubRepository.findAll(pageable);
    }

    // CREATE
    public ClubEntity create(ClubEntity club) {
        club.setFechaAlta(LocalDateTime.now());
        return clubRepository.save(club);
    }

    // UPDATE
    public ClubEntity update(Long id, ClubEntity club) {
        club.setId(id);
        return clubRepository.save(club);
    }

    // DELETE
    public void delete(Long id) {
        clubRepository.deleteById(id);
    }

    // COUNT
    public long count() {
        return clubRepository.count();
    }

    // EMPTY
    public void empty() {
        clubRepository.deleteAll();
    }

    // FILL
    public void fill(int amount) {
        for (int i = 0; i < amount; i++) {
            ClubEntity club = new ClubEntity();

            club.setNombre("Club " + i);
            club.setDireccion("Dirección " + i);
            club.setTelefono("600000" + i);
            club.setFechaAlta(LocalDateTime.now());

            // claves ajenas aleatorias (1–50)
            club.setIdPresidente((long) (random.nextInt(50) + 1));
            club.setIdVicepresidente((long) (random.nextInt(50) + 1));

            club.setImagen(("imagen" + i).getBytes());

            clubRepository.save(club);
        }
    }
}
