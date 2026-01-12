package net.ausiasmarch.gesportin.api;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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

import net.ausiasmarch.gesportin.entity.FacturaEntity;
import net.ausiasmarch.gesportin.service.FacturaService;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
@RequestMapping("/factura")
public class FacturaApi{

    @Autowired
    FacturaService oFacturaService;

    @GetMapping("/{id}")
    public ResponseEntity<FacturaEntity> get(@PathVariable Long id) {
        try {
            FacturaEntity e = oFacturaService.get(id);
            return ResponseEntity.ok(e);
        } catch (RuntimeException ex) {
           return ResponseEntity.notFound().build();
        }
    }

    //Crear Factura
    @PostMapping("")
    public ResponseEntity<Long> create(@RequestBody FacturaEntity facturaEntity) {
        return ResponseEntity.ok(oFacturaService.create(facturaEntity));
    }

    //Modificar Factura
    @PutMapping("")
    public ResponseEntity<Long> update(@RequestBody FacturaEntity facturaEntity) {
        return ResponseEntity.ok(oFacturaService.update(facturaEntity));
    }
    
    //Borrar Factura
    @DeleteMapping("/{id}")
    public ResponseEntity<Long> delete(@PathVariable Long id) {
        return ResponseEntity.ok(oFacturaService.delete(id));
    }

    //Borrar Todas las Facturas
    @GetMapping("/empty")
    public ResponseEntity<Long> empty() {
        return ResponseEntity.ok(oFacturaService.empty());
    }

    //GetPage de Factura
    @GetMapping("")
    public ResponseEntity<Page<FacturaEntity>> getPage(Pageable oPageable) {
        return ResponseEntity.ok(oFacturaService.getPage(oPageable));
    }

    //Cuenta las Facturas
    @GetMapping("/count")
    public ResponseEntity<Long> count() {
        return ResponseEntity.ok(oFacturaService.count()); 
    }

    //Crea Facturas
    @GetMapping("/rellena/{numFacturas}")
    public ResponseEntity<Long> rellenaFacturas(@PathVariable int numFacturas) {
        return ResponseEntity.ok(oFacturaService.rellenaFacturas(numFacturas));
    }

    @GetMapping(value = "/view/{id}", produces = MediaType.TEXT_HTML_VALUE)
    public ResponseEntity<String> view(@PathVariable Long id) {
        try {
            FacturaEntity e = oFacturaService.get(id);
            StringBuilder sb = new StringBuilder();
            sb.append("<!doctype html><html><head><meta charset=\"utf-8\"><title>Factura ").append(e.getId())
                    .append("</title></head><body>");
            sb.append("<h1>Factura #").append(e.getId()).append("</h1>");
            sb.append("<ul>");
            sb.append("<li>Fecha: ").append(e.getFecha() != null ? e.getFecha().toString() : "(sin fecha)")
                    .append("</li>");
            sb.append("<li>Id usuario: ").append(e.getId_usuario()).append("</li>");
            sb.append("</ul>");
            sb.append("</body></html>");
            return ResponseEntity.ok(sb.toString());
        } catch (RuntimeException ex) {
            String body = "<!doctype html><html><head><meta charset=\"utf-8\"><title>Factura no encontrada</title></head><body><h1>Factura no encontrada</h1></body></html>";
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
        }
    }
}