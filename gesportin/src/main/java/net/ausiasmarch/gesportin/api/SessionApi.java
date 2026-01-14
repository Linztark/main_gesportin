package net.ausiasmarch.gesportin.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import net.ausiasmarch.gesportin.bean.SessionBean;
import net.ausiasmarch.gesportin.bean.TokenBean;
import net.ausiasmarch.gesportin.service.SessionService;

@CrossOrigin(origins = "*", allowedHeaders = "*", maxAge = 3600)
@RestController
@RequestMapping("/session")
public class SessionApi {
    
    @Autowired
    private SessionService oSessionService;

    @PostMapping("/login")
    public ResponseEntity<TokenBean> login(@RequestBody SessionBean oSessionBean) {
        return ResponseEntity.ok(oSessionService.login(oSessionBean));
    }

    @GetMapping("/check")
    public ResponseEntity<Boolean> check() {
        String username = (String) org.springframework.web.context.request.RequestContextHolder.currentRequestAttributes()
                .getAttribute("username", org.springframework.web.context.request.RequestAttributes.SCOPE_REQUEST);
        return ResponseEntity.ok(username != null); // true si hay sesion activa, false si no
    }

}
