package net.ausiasmarch.gesportin.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import net.ausiasmarch.gesportin.entity.CategoriaEntity;
import net.ausiasmarch.gesportin.exception.ResourceNotFoundException;
import net.ausiasmarch.gesportin.repository.CategoriaRepository;

@Service
public class CategoriaService {
    
    @Autowired
    AleatorioService aleatorioService;

    @Autowired
    CategoriaRepository categoriaRepository;

    private static final String[] CATEGORIAS = {"Querubín", "Pre-benjamín", "Benjamín", "Alevín", "Infantil", "Cadete", "Juvenil", "Amateur"};


    public CategoriaEntity get(Long id){
        return categoriaRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Category not found"));
    }

    public Page<CategoriaEntity> getPage(Pageable pageable) {
        return categoriaRepository.findAll(pageable);
    }

    public CategoriaEntity create(CategoriaEntity categoriaEntity) {
        categoriaEntity.setId(null);
        return categoriaRepository.save(categoriaEntity);
    }

    public CategoriaEntity update(CategoriaEntity categoriaEntity) {
        CategoriaEntity existingCategoria = categoriaRepository.findById(categoriaEntity.getId()).orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        existingCategoria.setNombre(categoriaEntity.getNombre());
        existingCategoria.setIdTemporada(categoriaEntity.getIdTemporada());
        return categoriaRepository.save(existingCategoria);
    }

    public Long delete(Long id) {
        categoriaRepository.deleteById(id);
        return id;
    }

    public Long fill(Long numCategorias) {
        for (long j = 0; j < numCategorias; j++) {
            CategoriaEntity categoriaEntity = new CategoriaEntity();
            categoriaEntity.setNombre(CATEGORIAS[aleatorioService.generarNumeroAleatorioEnteroEnRango(0, CATEGORIAS.length - 1)]);
            categoriaEntity.setIdTemporada((long) aleatorioService.generarNumeroAleatorioEnteroEnRango(1, 50));
            categoriaRepository.save(categoriaEntity);
        }

        return numCategorias;
    }

    public Long empty() {
        categoriaRepository.deleteAll();
        categoriaRepository.flush();
        return 0L;

    }

    public Long count() {
        return categoriaRepository.count();
    }

}
