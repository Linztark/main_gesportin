package net.ausiasmarch.gesportin.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import net.ausiasmarch.gesportin.service.SeedService;

@RestController
@RequestMapping("/admin")
public class SeedApi {

    @Autowired
    private SeedService oSeedService;

    /** Seed missing system data (idempotent — skips tables already populated). */
    @PostMapping("/seed")
    public ResponseEntity<Long> seed() {
        return ResponseEntity.ok(oSeedService.seed());
    }

    /**
     * Full transactional reset: deletes ALL data in safe FK order, then
     * re-seeds the minimum system data (tipousuario, rolusuario, club, 3 users).
     * Admin check is performed once at the start of the single transaction.
     */
    @PostMapping("/reset")
    public ResponseEntity<Long> reset() {
        return ResponseEntity.ok(oSeedService.reset());
    }
}
