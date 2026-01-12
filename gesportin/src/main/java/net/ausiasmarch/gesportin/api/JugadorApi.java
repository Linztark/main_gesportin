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

import net.ausiasmarch.gesportin.entity.JugadorEntity;
import net.ausiasmarch.gesportin.service.AleatorioService;
import net.ausiasmarch.gesportin.service.JugadorService;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
@RequestMapping("/jugador")
public class JugadorApi {
    
    @Autowired
    AleatorioService oAleatorioService;

    @Autowired
    JugadorService oJugadorService;

    // Obtener un jugador por su ID
    @GetMapping("/{id}")
    public ResponseEntity<JugadorEntity> get(@PathVariable Long id) {
        return ResponseEntity.ok(oJugadorService.get(id));
    }

    // Crear un jugador
    @PostMapping("")
    public ResponseEntity<JugadorEntity> create(@RequestBody JugadorEntity oJugadorEntity) {
        return ResponseEntity.ok(oJugadorService.create(oJugadorEntity));
    }

    // Modificar un jugador
    @PutMapping("")
    public ResponseEntity<Long> update(@RequestBody JugadorEntity oJugadorEntity) {
        return ResponseEntity.ok(oJugadorService.update(oJugadorEntity));
    }

    // Borrar un jugador
    @DeleteMapping("/{id}")
    public ResponseEntity<Long> delete(@PathVariable Long id) {
        return ResponseEntity.ok(oJugadorService.delete(id));
    }

    // Rellenar datos "fake"
    @GetMapping("/rellena/{numPosts}")
    public ResponseEntity<Long> creaEquipo(
            @PathVariable Long numPosts) {
        return ResponseEntity.ok(oJugadorService.crearJugador(numPosts));
    }

    // Vaciar la tabla (solo para administradores)
    @DeleteMapping("/empty")
    public ResponseEntity<Long> empty() {
        return ResponseEntity.ok(oJugadorService.empty());
    }

    // Listado paginado de jugador
    @GetMapping("")
    public ResponseEntity<Page<JugadorEntity>> getPage(Pageable oPageable) {
        return ResponseEntity.ok(oJugadorService.getPage(oPageable));
    }

    @GetMapping("/count")
    public ResponseEntity<Long> count() {
        return ResponseEntity.ok(oJugadorService.count());
    }
}
