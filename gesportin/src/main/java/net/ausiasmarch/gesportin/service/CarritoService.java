package net.ausiasmarch.gesportin.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import net.ausiasmarch.gesportin.entity.CarritoEntity;
import net.ausiasmarch.gesportin.repository.CarritoRepository;

@Service
public class CarritoService {
    
    @Autowired
    CarritoRepository oCarritoRepository;

    @Autowired
    AleatorioService oAleatorioService;

    public CarritoEntity get(Long id) {
        return oCarritoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("No se encuentra el carrito con id: " + id));
    }

    public Page<CarritoEntity> getPage(Pageable oPageable) {
        return oCarritoRepository.findAll(oPageable);
    }

    public Long create(CarritoEntity oCarritoEntity) {
        oCarritoEntity.setId(null);
        oCarritoRepository.save(oCarritoEntity);
        return oCarritoEntity.getId();
    }

    public Long update(CarritoEntity oCarritoEntity) {
        CarritoEntity existingCarrito = oCarritoRepository.findById(oCarritoEntity.getId())
                .orElseThrow(() -> new EntityNotFoundException("No se puede actualizar ID no encontrado"));
        existingCarrito.setCantidad(oCarritoEntity.getCantidad());
        existingCarrito.setIdArticulo(oCarritoEntity.getIdArticulo());
        existingCarrito.setIdUsuario(oCarritoEntity.getIdUsuario());
        oCarritoRepository.save(existingCarrito);
        return existingCarrito.getId();
    }

    public Long delete(Long id) {
        if (!oCarritoRepository.existsById(id)) {
            throw new EntityNotFoundException("ID no encontrado");
        }
        oCarritoRepository.deleteById(id);
        return id;
    }

    public Long fill(Long cantidad) {
        for (long i = 0L; i < cantidad; i++) {
            CarritoEntity oCarritoEntity = new CarritoEntity();
            oCarritoEntity.setCantidad(oAleatorioService.GenerarNumeroAleatorioEnteroEnRango(1, 50));
            oCarritoEntity.setIdArticulo((Long) (long)oAleatorioService.GenerarNumeroAleatorioEnteroEnRango(1, 50));
            oCarritoEntity.setIdUsuario((Long) (long)oAleatorioService.GenerarNumeroAleatorioEnteroEnRango(1, 50));
            oCarritoRepository.save(oCarritoEntity);
        }

        return cantidad;
    }

    public Long empty() {
        Long total = oCarritoRepository.count();
        oCarritoRepository.deleteAll();
        return total;
    }

    public Long count() {
        return oCarritoRepository.count();
    }


}
