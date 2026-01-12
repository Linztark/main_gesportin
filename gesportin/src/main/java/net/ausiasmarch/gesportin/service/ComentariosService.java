package net.ausiasmarch.gesportin.service;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import net.ausiasmarch.gesportin.entity.ComentariosEntity;
import net.ausiasmarch.gesportin.exception.ResourceNotFoundException;
import net.ausiasmarch.gesportin.repository.ComentariosRepository;

@Service
public class ComentariosService {

    @Autowired
    ComentariosRepository oComentariosRepository;

    @Autowired
    AleatorioService oAleatorioService;

    ArrayList<String> alComentarios = new ArrayList<>();

    public ComentariosService() {
        alComentarios.add("Excelente artículo, muy informativo.");
        alComentarios.add("No estoy de acuerdo con algunos puntos.");
        alComentarios.add("Muy interesante, gracias por compartir.");
        alComentarios.add("¿Podrías ampliar más sobre este tema?");
        alComentarios.add("Me ha encantado, muy bien explicado.");
        alComentarios.add("Creo que falta profundizar en algunos aspectos.");
        alComentarios.add("Gran aportación a la comunidad.");
        alComentarios.add("Totalmente de acuerdo con tu opinión.");
        alComentarios.add("Necesito más ejemplos para entenderlo mejor.");
        alComentarios.add("Fantástico contenido, sigue así.");
        alComentarios.add("Me parece un enfoque muy innovador.");
        alComentarios.add("Hay algunos errores que deberías corregir.");
        alComentarios.add("Esto me ha ayudado mucho, gracias.");
        alComentarios.add("No me queda claro el último punto.");
        alComentarios.add("Muy útil para mi proyecto actual.");
    }

    public Long rellenaComentarios(Long numComentarios) {
        for (long j = 0; j < numComentarios; j++) {
            ComentariosEntity oComentariosEntity = new ComentariosEntity();
            
            // Generar contenido aleatorio
            String contenidoGenerado = "";
            int numFrases = oAleatorioService.GenerarNumeroAleatorioEnteroEnRango(1, 3);
            for (int i = 1; i <= numFrases; i++) {
                contenidoGenerado += alComentarios
                        .get(oAleatorioService.GenerarNumeroAleatorioEnteroEnRango(0, alComentarios.size() - 1)) + " ";
            }
            oComentariosEntity.setContenido(contenidoGenerado.trim());
            
            // Generar id_articulo e id_usuario aleatorios entre 0 y 50
            oComentariosEntity.setId_articulo((long) oAleatorioService.GenerarNumeroAleatorioEnteroEnRango(0, 50));
            oComentariosEntity.setId_usuario((long) oAleatorioService.GenerarNumeroAleatorioEnteroEnRango(0, 50));
            
            // Guardar entity en base de datos
            oComentariosRepository.save(oComentariosEntity);
        }
        return oComentariosRepository.count();
    }

    // ----------------------------CRUD---------------------------------
    public ComentariosEntity get(Long id) {
        return oComentariosRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comentario not found"));
    }

    public Long create(ComentariosEntity comentariosEntity) {
        // Si no se especifican id_articulo o id_usuario, generar valores aleatorios
        if (comentariosEntity.getId_articulo() == null) {
            comentariosEntity.setId_articulo((long) oAleatorioService.GenerarNumeroAleatorioEnteroEnRango(0, 50));
        }
        if (comentariosEntity.getId_usuario() == null) {
            comentariosEntity.setId_usuario((long) oAleatorioService.GenerarNumeroAleatorioEnteroEnRango(0, 50));
        }
        oComentariosRepository.save(comentariosEntity);
        return comentariosEntity.getId();
    }

    public Long update(ComentariosEntity comentariosEntity) {
        ComentariosEntity existingComentario = oComentariosRepository.findById(comentariosEntity.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Comentario not found"));
        existingComentario.setContenido(comentariosEntity.getContenido());
        existingComentario.setId_articulo(comentariosEntity.getId_articulo());
        existingComentario.setId_usuario(comentariosEntity.getId_usuario());
        oComentariosRepository.save(existingComentario);
        return existingComentario.getId();
    }

    public Long delete(Long id) {
        oComentariosRepository.deleteById(id);
        return id;
    }

    public Page<ComentariosEntity> getPage(Pageable oPageable) {
        return oComentariosRepository.findAll(oPageable);
    }

    public Long count() {
        return oComentariosRepository.count();
    }

    // Vaciar tabla comentarios
    public Long empty() {
        Long total = oComentariosRepository.count();
        oComentariosRepository.deleteAll();
        return total;
    }

}
