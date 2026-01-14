package net.ausiasmarch.gesportin.service;

import org.springframework.stereotype.Service;

@Service
public class AleatorioService {

    public int generarNumeroAleatorioEnteroEnRango(int min, int max) {
        return (int) (Math.random() * (max - min + 1)) + min;
    }
    
}
