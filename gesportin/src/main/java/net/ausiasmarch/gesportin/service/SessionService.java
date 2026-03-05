package net.ausiasmarch.gesportin.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import net.ausiasmarch.gesportin.bean.SessionBean;
import net.ausiasmarch.gesportin.bean.TokenBean;
import net.ausiasmarch.gesportin.entity.UsuarioEntity;
import net.ausiasmarch.gesportin.repository.UsuarioRepository;

@Service
public class SessionService {

    @Autowired
    private JWTService oJwtService;

    @Autowired
    private UsuarioRepository oUsuarioRepository;

    public TokenBean login(SessionBean oSessionBean) {
        // Lógica de autenticación aquí
        // hardcoded
        if ("admin".equals(oSessionBean.getUsername()) && "7e4b4f5529e084ecafb996c891cfbd5b5284f5b00dc155c37bbb62a9f161a72e".equalsIgnoreCase(oSessionBean.getPassword())) { //ausias
            // generar el token JWT
            return (new TokenBean(oJwtService.generateJWT(oSessionBean.getUsername())));
        } else {
            return null; // Autenticación fallida Rafa -> cambiar por excepcion
        }
    }

    public boolean isSessionActive() {
        String username = (String) org.springframework.web.context.request.RequestContextHolder.currentRequestAttributes()
                .getAttribute("username", org.springframework.web.context.request.RequestAttributes.SCOPE_REQUEST);
        return username != null;
    }

    public String getUsername() {
        String username = (String) org.springframework.web.context.request.RequestContextHolder.currentRequestAttributes()
                .getAttribute("username", org.springframework.web.context.request.RequestAttributes.SCOPE_REQUEST);
        return username;
    }

    public boolean isAdmin() {
        String username = (String) org.springframework.web.context.request.RequestContextHolder.currentRequestAttributes()
                .getAttribute("username", org.springframework.web.context.request.RequestAttributes.SCOPE_REQUEST);
        // obtener el usuarioEntity relleno de la database utilizando el repository de usuario a partir del username y comprobar si es admin
        UsuarioEntity oUsuarioEntity = oUsuarioRepository.findByUsername(username).orElse(null);
        return oUsuarioEntity != null && oUsuarioEntity.getTipousuario().getId() == 1;
    }

    public boolean isEquipoAdmin() {
        String username = (String) org.springframework.web.context.request.RequestContextHolder.currentRequestAttributes()
                .getAttribute("username", org.springframework.web.context.request.RequestAttributes.SCOPE_REQUEST);
        // obtener el usuarioEntity relleno de la database utilizando el repository de usuario a partir del username y comprobar si es admin
        UsuarioEntity oUsuarioEntity = oUsuarioRepository.findByUsername(username).orElse(null);
        return oUsuarioEntity != null && oUsuarioEntity.getTipousuario().getId() == 2;
    }

    public boolean isUsuario() {
        String username = (String) org.springframework.web.context.request.RequestContextHolder.currentRequestAttributes()
                .getAttribute("username", org.springframework.web.context.request.RequestAttributes.SCOPE_REQUEST);
        // obtener el usuarioEntity relleno de la database utilizando el repository de usuario a partir del username y comprobar si es admin
        UsuarioEntity oUsuarioEntity = oUsuarioRepository.findByUsername(username).orElse(null);
        return oUsuarioEntity != null && oUsuarioEntity.getTipousuario().getId() == 3;
    }

}
