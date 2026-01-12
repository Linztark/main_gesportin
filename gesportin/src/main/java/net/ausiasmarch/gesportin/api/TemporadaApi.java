package net.ausiasmarch.gesportin.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
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
import org.springframework.web.bind.annotation.RestController;

import net.ausiasmarch.gesportin.entity.TemporadaEntity;
import net.ausiasmarch.gesportin.service.TemporadaService;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
@RequestMapping("/temporada")
public class TemporadaApi {

    @Autowired
    private TemporadaService oTemporadaService;

    // ---------------------------- CRUD ----------------------------

    @GetMapping("/{id}")
    public ResponseEntity<TemporadaEntity> get(@PathVariable Long id) {
        return ResponseEntity.ok(oTemporadaService.get(id));
    }

    @PostMapping("")
    public ResponseEntity<Long> create(@RequestBody TemporadaEntity oTemporadaEntity) {
        return ResponseEntity.ok(oTemporadaService.create(oTemporadaEntity));
    }

    @PutMapping("")
    public ResponseEntity<Long> update(@RequestBody TemporadaEntity oTemporadaEntity) {
        return ResponseEntity.ok(oTemporadaService.update(oTemporadaEntity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Long> delete(@PathVariable Long id) {
        return ResponseEntity.ok(oTemporadaService.delete(id));
    }

    @GetMapping("")
    public ResponseEntity<Page<TemporadaEntity>> getPage(Pageable oPageable) {
        return ResponseEntity.ok(oTemporadaService.getPage(oPageable));
    }

    @GetMapping("/count")
    public ResponseEntity<Long> count() {
        return ResponseEntity.ok(oTemporadaService.count());
    }

    // ---------------------------- EXTRA ----------------------------

    @GetMapping("/fill/{cantidad}")
    public ResponseEntity<Long> fill(@PathVariable Long cantidad) {
        return ResponseEntity.ok(oTemporadaService.fill(cantidad));
    }

    @DeleteMapping("/empty")
    public ResponseEntity<Long> empty() {
        return ResponseEntity.ok(oTemporadaService.empty());
    }
}


