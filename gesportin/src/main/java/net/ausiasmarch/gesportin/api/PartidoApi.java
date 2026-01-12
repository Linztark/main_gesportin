package net.ausiasmarch.gesportin.api;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

import net.ausiasmarch.gesportin.entity.PartidoEntity;
import net.ausiasmarch.gesportin.service.AleatorioService;
import net.ausiasmarch.gesportin.service.PartidoService;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
@RequestMapping("/partido")
public class PartidoApi {

    @Autowired
    AleatorioService oAleatorioService;

     @Autowired
    PartidoService oPartidoService;

    //GET:

     @GetMapping("/{id}")
    public ResponseEntity<PartidoEntity> get(@PathVariable Long id) {
        return ResponseEntity.ok(oPartidoService.get(id));
    }

    //GET PAGE:

    @GetMapping("")
    public ResponseEntity<Page<PartidoEntity>> getPage(Pageable oPageable) {
        return ResponseEntity.ok(oPartidoService.getPage(oPageable));
    }

    //CREATE:

    @PostMapping("")
    public ResponseEntity<Long> create(@RequestBody PartidoEntity partidoEntity) {
        return ResponseEntity.ok(oPartidoService.create(partidoEntity));
    }

    // UPDATE:

    @PutMapping("")
    public ResponseEntity<Long> update(@RequestBody PartidoEntity partidoEntity) {
        return ResponseEntity.ok(oPartidoService.update(partidoEntity));
    }

    // DELETE:

    @DeleteMapping("/{id}")
    public ResponseEntity<Long> delete(@PathVariable Long id) {
        return ResponseEntity.ok(oPartidoService.delete(id));
    }

    //FILL:

    @GetMapping("/rellena/{numPosts}")
    public ResponseEntity<Long> rellenaBlog(
            @PathVariable Long numPosts) {
        return ResponseEntity.ok(oPartidoService.rellenaPartido(numPosts));
    }

    //EMPTY:

    @DeleteMapping("/empty")
    public ResponseEntity<Long> empty() {
        return ResponseEntity.ok(oPartidoService.empty());
    }

    //COUNT:
    
    @GetMapping("/count")
    public ResponseEntity<Long> count() {
        return ResponseEntity.ok(oPartidoService.count());
    }
    
}
