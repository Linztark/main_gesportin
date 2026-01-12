package net.ausiasmarch.gesportin.api;

import org.springframework.beans.factory.annotation.Autowired;
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

import net.ausiasmarch.gesportin.entity.EquipoEntity;
import net.ausiasmarch.gesportin.service.EquipoService;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
@RequestMapping("/equipo")
public class EquipoApi {

    @Autowired
    EquipoService equipoService;

    @GetMapping("/{id}")
    public ResponseEntity<EquipoEntity> get(@PathVariable Long id) {
        return ResponseEntity.ok(equipoService.get(id));
    }

    @GetMapping("/count")
    public ResponseEntity<Long> count() {
        return ResponseEntity.ok(equipoService.count());
    }

    @PostMapping("")
    public ResponseEntity<Long> create(@RequestBody EquipoEntity equipoEntity) {
        return ResponseEntity.ok(equipoService.create(equipoEntity));
    }

    @PutMapping("")
    public ResponseEntity<Long> update(@RequestBody EquipoEntity equipoEntity) {
        return ResponseEntity.ok(equipoService.update(equipoEntity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Long> delete(@PathVariable Long id) {
        return ResponseEntity.ok(equipoService.delete(id));
    }

    @DeleteMapping("/empty")
    public ResponseEntity<Long> empty() {
        return ResponseEntity.ok(equipoService.empty());
    }

    @PostMapping("/fill/{amount}")
    public ResponseEntity<Long> fill(@PathVariable("amount") Long amount) {
        return ResponseEntity.ok(equipoService.fill(amount));
    }
}