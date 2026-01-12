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

import net.ausiasmarch.gesportin.entity.CategoriaEntity;
import net.ausiasmarch.gesportin.service.CategoriaService;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
@RequestMapping("/categoria")

public class CategoriaAPI {
    

     @Autowired
     CategoriaService categoriaService;

    // ---------------------------Rellenar datos fake ---------------------------

    // @GetMapping("/rellena")
    // public ResponseEntity<Long> () {
    //     return ResponseEntity.ok(categoriaService.rellenaCategorias());
    // }

    //----------------------------CRUD---------------------------------

    //Obtener Categoría por id
    @GetMapping("/{id}")
    public ResponseEntity<CategoriaEntity> get(@PathVariable Long id) {
        return ResponseEntity.ok(categoriaService.get(id));
    }

    // Obtener un listado paginado de todas las categorías (getAll)
    @GetMapping("")
    public ResponseEntity<Page<CategoriaEntity>> getPage(Pageable pageable) {
        return ResponseEntity.ok(categoriaService.getPage(pageable));
    }

    // Crear Categoría
    @PostMapping("")
    public ResponseEntity<Long> create(@RequestBody CategoriaEntity categoriaEntity) {
        return ResponseEntity.ok(categoriaService.create(categoriaEntity));
    }

    // Actualizar Categoría
    @PutMapping("")
    public ResponseEntity<Long> update(@RequestBody CategoriaEntity categoriaEntity) {
        return ResponseEntity.ok(categoriaService.update(categoriaEntity));
    }

    // Borrar Categoría por id
    @DeleteMapping("/{id}")
    public ResponseEntity<Long> delete(@PathVariable Long id) {
        return ResponseEntity.ok(categoriaService.delete(id));
    }

    // Rellena
    @GetMapping("/fill/{numCategorias}")
    public ResponseEntity<Long> fill(@PathVariable Long numCategorias) {
        return ResponseEntity.ok(categoriaService.fill(numCategorias));
    }

    // Vaciar la tabla Categoría
    @DeleteMapping("/empty")
    public ResponseEntity<Long> empty() {
        return ResponseEntity.ok(categoriaService.empty());
    }

    @GetMapping("/count")
    public ResponseEntity<Long> count() {
        return ResponseEntity.ok(categoriaService.count());
    }

} 
