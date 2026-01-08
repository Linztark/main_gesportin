package net.ausiasmarch.gesportin.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.constraints.NotNull;
import net.ausiasmarch.gesportin.entity.PuntuacionEntity;
import net.ausiasmarch.gesportin.service.PuntuacionService;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
@RequestMapping("/puntuacion")
public class PuntuacionApi {
    @Autowired
    PuntuacionService oPuntuacionService;

    // listado paginado de puntuación
    @GetMapping("")
    public ResponseEntity<Page<PuntuacionEntity>> getPage(@NotNull Pageable oPageable) {
        return ResponseEntity.ok(oPuntuacionService.getPage(oPageable));
    }
}
