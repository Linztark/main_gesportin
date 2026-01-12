package net.ausiasmarch.gesportin.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
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

import net.ausiasmarch.gesportin.entity.ComentariosEntity;
import net.ausiasmarch.gesportin.service.AleatorioService;
import net.ausiasmarch.gesportin.service.ComentariosService;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
@RequestMapping("/comentarios")
public class ComentariosAPI {

    @Autowired
    AleatorioService oAleatorioService;

    @Autowired
    ComentariosService oComentariosService;

    @GetMapping("/saludar")
    public ResponseEntity<String> saludar() {
        return new ResponseEntity<>("\"Hola desde comentarios\"", HttpStatus.OK);
    }

    @GetMapping("/aleatorio")
    public ResponseEntity<Integer> aleatorio() {
        int numeroAleatorio = (int) (Math.random() * 100) + 1;
        return ResponseEntity.ok(numeroAleatorio);
    }

    @GetMapping("/aleatorio/{min}/{max}")
    public ResponseEntity<Integer> aleatorioEnRango(
            @PathVariable int min,
            @PathVariable int max) {
        int numeroAleatorio = (int) (Math.random() * (max - min + 1)) + min;
        return ResponseEntity.ok(numeroAleatorio);
    }

    @GetMapping("/aleatorio/service/{min}/{max}")
    public ResponseEntity<Integer> aleatorioUsandoServiceEnRango(
            @PathVariable int min,
            @PathVariable int max) {
        return ResponseEntity.ok(oAleatorioService.GenerarNumeroAleatorioEnteroEnRango(min, max));
    }

    // ---------------------------Rellenar datos fake comentarios---------------------------------

    @GetMapping("/rellena/{numComentarios}")
    public ResponseEntity<Long> rellenaComentarios(
            @PathVariable Long numComentarios) {
        return ResponseEntity.ok(oComentariosService.rellenaComentarios(numComentarios));
    }

    // ----------------------------CRUD---------------------------------

    // Obtener comentario por id
    @GetMapping("/{id}")
    public ResponseEntity<ComentariosEntity> get(@PathVariable Long id) {
        return ResponseEntity.ok(oComentariosService.get(id));
    }

    // Crear comentario
    @PostMapping("")
    public ResponseEntity<Long> create(@RequestBody ComentariosEntity comentariosEntity) {
        return ResponseEntity.ok(oComentariosService.create(comentariosEntity));
    }

    // Modificar comentario
    @PutMapping("")
    public ResponseEntity<Long> update(@RequestBody ComentariosEntity comentariosEntity) {
        return ResponseEntity.ok(oComentariosService.update(comentariosEntity));
    }

    // Borrar comentario
    @DeleteMapping("/{id}")
    public ResponseEntity<Long> delete(@PathVariable Long id) {
        return ResponseEntity.ok(oComentariosService.delete(id));
    }

    // Vaciar tabla comentarios
    @DeleteMapping("/empty")
    public ResponseEntity<Long> empty() {
        return ResponseEntity.ok(oComentariosService.empty());
    }

    // Listado paginado de comentarios
    @GetMapping("")
    public ResponseEntity<Page<ComentariosEntity>> getPage(Pageable oPageable) {
        return ResponseEntity.ok(oComentariosService.getPage(oPageable));
    }

    @GetMapping("/count")
    public ResponseEntity<Long> count() {
        return ResponseEntity.ok(oComentariosService.count());
    }

}
