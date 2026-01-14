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

import net.ausiasmarch.gesportin.entity.CuotaEntity;
import net.ausiasmarch.gesportin.service.CuotaService;

@CrossOrigin(origins = "*", allowedHeaders = "*", maxAge = 3600)
@RestController
@RequestMapping("/cuota")
public class CuotaApi {
    
    @Autowired
    private CuotaService oCuotaService;

    @GetMapping("/{id}")
    public ResponseEntity<CuotaEntity> get(@PathVariable Long id) {
        return ResponseEntity.ok(oCuotaService.get(id));
    }

    @GetMapping
    public ResponseEntity<Page<CuotaEntity>> getPage(Pageable oPageable) {
        return ResponseEntity.ok(oCuotaService.getPage(oPageable));
    }

    @PostMapping
    public ResponseEntity<CuotaEntity> create(@RequestBody CuotaEntity cuotaEntity) {
        return ResponseEntity.ok(oCuotaService.create(cuotaEntity));
    }

    @PutMapping
    public ResponseEntity<CuotaEntity> update(@RequestBody CuotaEntity cuotaEntity) {
        return ResponseEntity.ok(oCuotaService.update(cuotaEntity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Long> delete(@PathVariable Long id) {
        return ResponseEntity.ok(oCuotaService.delete(id));
    }

    @GetMapping("/fill/{cantidad}")
    public ResponseEntity<Long> fill(@PathVariable Long cantidad) {
        return ResponseEntity.ok(oCuotaService.fill(cantidad));
    }

    @DeleteMapping("/empty")
    public ResponseEntity<Long> empty() {
        return ResponseEntity.ok(oCuotaService.empty());
    }

    @GetMapping("/count")
    public ResponseEntity<Long> count() {
        return ResponseEntity.ok(oCuotaService.count());
    }

}
