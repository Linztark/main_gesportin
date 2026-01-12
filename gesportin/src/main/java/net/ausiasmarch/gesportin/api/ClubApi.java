package net.ausiasmarch.gesportin.api;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import net.ausiasmarch.gesportin.entity.ClubEntity;
import net.ausiasmarch.gesportin.service.ClubService;

@RestController
@RequestMapping("/api/clubs")
@CrossOrigin(origins = "*")
public class ClubApi {

    private final ClubService clubService;

    public ClubApi(ClubService clubService) {
        this.clubService = clubService;
    }

    // GET
    @GetMapping
    public List<ClubEntity> getAll() {
        return clubService.getAll();
    }

    // GET BY ID
    @GetMapping("/{id}")
    public ResponseEntity<ClubEntity> getById(@PathVariable Long id) {
        return clubService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // GET PAGE
    @GetMapping("/page")
    public Page<ClubEntity> getPage(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        return clubService.getPage(pageable);
    }

    // CREATE
    @PostMapping
    public ClubEntity create(@RequestBody ClubEntity club) {
        return clubService.create(club);
    }

    // UPDATE
    @PutMapping("/{id}")
    public ClubEntity update(@PathVariable Long id, @RequestBody ClubEntity club) {
        return clubService.update(id, club);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        clubService.delete(id);
    }

    // FILL
    @GetMapping("/fill/{amount}")
    public void fill(@PathVariable int amount) {
        clubService.fill(amount);
    }

    // EMPTY
    @DeleteMapping("/empty")
    public void empty() {
        clubService.empty();
    }

    // COUNT
    @GetMapping("/count")
    public long count() {
        return clubService.count();
    }
}
