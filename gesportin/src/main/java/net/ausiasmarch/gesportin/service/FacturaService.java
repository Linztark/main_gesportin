package net.ausiasmarch.gesportin.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import net.ausiasmarch.gesportin.entity.FacturaEntity;
import net.ausiasmarch.gesportin.exception.ResourceNotFoundException;
import net.ausiasmarch.gesportin.repository.FacturaRepository;

@Service
public class FacturaService {

    @Autowired
    FacturaRepository oFacturaRepository;

    public FacturaEntity get(Long id) {
    return oFacturaRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Factura no encontrada"));
    }

    public Long create(FacturaEntity facturaEntity) {
        facturaEntity.setFecha(LocalDateTime.now());
        Long idUsuario = facturaEntity.getIdUsuario();
        if (idUsuario <= 0) {
            facturaEntity.setIdUsuario((long)GenerarNumeroAleatorioEnRango(1, 50));
        }
        oFacturaRepository.save(facturaEntity);
        return facturaEntity.getId();
    }

    public Long update(FacturaEntity facturaEntity) {
        FacturaEntity existingFacturaCompra = oFacturaRepository.findById(facturaEntity.getId())
                .orElseThrow(() -> new RuntimeException("Factura no encontrada"));
        existingFacturaCompra.setIdUsuario(facturaEntity.getIdUsuario());
        existingFacturaCompra.setFecha(LocalDateTime.now());
        oFacturaRepository.save(existingFacturaCompra);
        return existingFacturaCompra.getId();
    }

    public Long delete(Long id) {
        if (!oFacturaRepository.existsById(id)) {
            throw new ResourceNotFoundException("Factura no encontrada");
        }
        oFacturaRepository.deleteById(id);
        return oFacturaRepository.count();
    }

    public Page<FacturaEntity> getPage(Pageable oPageable) {
        return oFacturaRepository.findAll(oPageable);
    }

    public Long count() {
        return oFacturaRepository.count();
    }

    public Long fillFacturas(int numQuestions) {
        for (int i = 0; i < numQuestions; i++) {
            FacturaEntity oFacturaEntity = new FacturaEntity();
            oFacturaEntity.setFecha(LocalDateTime.now());
            oFacturaEntity.setIdUsuario((long)GenerarNumeroAleatorioEnRango(1, 50));
            oFacturaRepository.save(oFacturaEntity);
        }
        return oFacturaRepository.count();
    }

    public int GenerarNumeroAleatorio() {
        return GenerarNumeroAleatorioEnRango(1, 4);
    }

    public int GenerarNumeroAleatorioEnRango(int min, int max) {
        return (int) (Math.random() * (max - min + 1)) + min;
    }

    public Long empty() {
        Long total = oFacturaRepository.count();
        oFacturaRepository.deleteAll();
        return total;
    }
}