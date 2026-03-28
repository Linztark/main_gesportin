package net.ausiasmarch.gesportin.filter;

import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import net.ausiasmarch.gesportin.exception.UnauthorizedException;
import net.ausiasmarch.gesportin.service.SessionService;

@Aspect
@Component
public class AdminCrudGuardAspect {

    @Autowired
    private SessionService oSessionService;

    @Before("(" +
            "execution(public * net.ausiasmarch.gesportin.service..*.fill(..)) || " +
            "execution(public * net.ausiasmarch.gesportin.service..*.empty(..))" +
            ") && !within(net.ausiasmarch.gesportin.service.SessionService)")
    public void requireAdminForFillEmpty() {
        if (!oSessionService.isAdmin()) {
            throw new UnauthorizedException("Acceso denegado: solo los administradores pueden realizar operaciones de llenado o vaciado.");
        }
    }

}
