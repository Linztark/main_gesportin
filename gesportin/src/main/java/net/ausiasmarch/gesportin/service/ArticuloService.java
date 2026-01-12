package net.ausiasmarch.gesportin.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import net.ausiasmarch.gesportin.entity.ArticuloEntity;
import net.ausiasmarch.gesportin.exception.ResourceNotFoundException;
import net.ausiasmarch.gesportin.repository.ArticuloRepository;

@Service
public class ArticuloService {

    @Autowired
    private ArticuloRepository articuloRepository;

    private final Random random = new Random();

    private final String[] descripciones = {
            "Camiseta oficial", "Pantalón corto", "Medias deportivas", "Balón oficial",
            "Zapatillas de fútbol", "Guantes de portero", "Espinilleras", "Sudadera",
            "Chaqueta de chándal", "Mochila deportiva", "Botella de agua", "Bufanda del club",
            "Gorra deportiva", "Muñequeras", "Cinta para el pelo", "Rodilleras",
            "Protector bucal", "Silbato", "Cronómetro", "Conos de entrenamiento",
            "Petos de entrenamiento", "Red de portería", "Bomba de aire", "Aguja para balones",
            "Camiseta de entrenamiento", "Pantalón largo", "Bolsa de deporte", "Toalla",
            "Chanclas", "Calcetines térmicos", "Chubasquero", "Polo del club",
            "Bermudas", "Leggins deportivos", "Top deportivo", "Cortavientos",
            "Chaleco reflectante", "Gafas de sol deportivas", "Reloj deportivo", "Pulsera fitness",
            "Protector solar", "Vendas elásticas", "Spray frío", "Crema muscular",
            "Bidón isotérmico", "Portabotellas", "Silbato electrónico", "Tarjetas de árbitro",
            "Marcador deportivo", "Pizarra táctica"
    };

    public ArticuloEntity get(Long id) {
        return articuloRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Articulo no encontrado con id: " + id));
    }

    public Page<ArticuloEntity> getPage(Pageable pageable, String descripcion, Long idTipoarticulo, Long idClub) {
        if (descripcion != null && !descripcion.isEmpty()) {
            return articuloRepository.findByDescripcionContainingIgnoreCase(descripcion, pageable);
        } else if (idTipoarticulo != null) {
            return articuloRepository.findByIdTipoarticulo(idTipoarticulo, pageable);
        } else if (idClub != null) {
            return articuloRepository.findByIdClub(idClub, pageable);
        } else {
            return articuloRepository.findAll(pageable);
        }
    }

    public ArticuloEntity create(ArticuloEntity articulo) {
        articulo.setId(null);
        return articuloRepository.save(articulo);
    }

    public ArticuloEntity update(ArticuloEntity articulo) {
        ArticuloEntity articuloExistente = articuloRepository.findById(articulo.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Articulo no encontrado con id: " + articulo.getId()));
        
        articuloExistente.setDescripcion(articulo.getDescripcion());
        articuloExistente.setPrecio(articulo.getPrecio());
        articuloExistente.setDescuento(articulo.getDescuento());
        articuloExistente.setImagen(articulo.getImagen());
        articuloExistente.setIdTipoarticulo(articulo.getIdTipoarticulo());
        articuloExistente.setIdClub(articulo.getIdClub());
        
        return articuloRepository.save(articuloExistente);
    }

    public Long delete(Long id) {
        ArticuloEntity articulo = articuloRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Articulo no encontrado con id: " + id));
        articuloRepository.delete(articulo);
        return id;
    }

    public Long empty() {
        articuloRepository.deleteAll();
        articuloRepository.flush();
        return 0L;
    }

    public Long count() {
        return articuloRepository.count();
    }

    public Long fill(Long cantidad) {
        for (int i = 0; i < cantidad; i++) {
            ArticuloEntity articulo = new ArticuloEntity();
            articulo.setDescripcion(descripciones[i % descripciones.length] + " " + (i + 1));
            articulo.setPrecio(BigDecimal.valueOf(random.nextDouble() * 100 + 5).setScale(2, RoundingMode.HALF_UP));
            articulo.setDescuento(random.nextBoolean() ? BigDecimal.valueOf(random.nextDouble() * 30).setScale(2, RoundingMode.HALF_UP) : null);
            articulo.setIdTipoarticulo((long) (random.nextInt(50) + 1));
            articulo.setIdClub((long) (random.nextInt(50) + 1));
            articuloRepository.save(articulo);
        }
        return cantidad;
    }

}
