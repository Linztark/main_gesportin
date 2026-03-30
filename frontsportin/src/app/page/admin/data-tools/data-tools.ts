import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import {
  AdminDataToolsService,
  DataEntityKey,
  EMPTY_ORDER,
  ENTITY_META,
  FILL_ORDER,
  IEntityMeta,
} from '../../../service/admin-data-tools';

interface IEntityRow extends IEntityMeta {
  count: number | null;
  loading: boolean;
}

@Component({
  selector: 'app-admin-data-tools-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-tools.html',
  styleUrl: './data-tools.css',
})
export class AdminDataToolsPage implements OnInit {
  private svc = inject(AdminDataToolsService);

  rows = signal<IEntityRow[]>(
    FILL_ORDER.map((key) => ({ ...ENTITY_META[key], count: null, loading: false })),
  );

  selectedAmount = signal<number>(10);
  running = signal<boolean>(false);
  logs = signal<string[]>([]);

  ngOnInit(): void {
    this.loadCounts();
  }

  // ── Counts ──────────────────────────────────────────────────────────────────

  async loadCounts(): Promise<void> {
    const updates = this.rows().map((r) => ({ ...r, loading: true }));
    this.rows.set(updates);

    const settled = await Promise.allSettled(
      FILL_ORDER.map((key) => firstValueFrom(this.svc.count(key))),
    );

    this.rows.set(
      FILL_ORDER.map((key, i) => {
        const meta = ENTITY_META[key];
        const result = settled[i];
        return {
          ...meta,
          count: result.status === 'fulfilled' ? result.value : null,
          loading: false,
        };
      }),
    );
  }

  setAmount(n: number): void {
    this.selectedAmount.set(n);
  }

  // ── Fill all ────────────────────────────────────────────────────────────────

  async runFillAll(): Promise<void> {
    if (this.running()) return;
    const amount = this.selectedAmount();
    this.running.set(true);
    this.clearLogs();

    this.log(`Iniciando creación de ${amount} registros por entidad en orden de dependencias...`);
    this.log(`Orden: ${FILL_ORDER.map((k) => ENTITY_META[k].label).join(' → ')}`);

    try {
      for (const entity of FILL_ORDER) {
        const label = ENTITY_META[entity].label;
        this.log(`Creando ${label}...`);
        const n = await firstValueFrom(this.svc.fill(entity, amount));
        this.log(`  ✓ ${label}: ${n} registro(s) creado(s)`);
      }
      this.log('Proceso de creación finalizado correctamente.');
    } catch (err) {
      this.log(`ERROR en creación: ${this.errMsg(err)}`);
    } finally {
      this.running.set(false);
      await this.loadCounts();
    }
  }

  // ── Reset ────────────────────────────────────────────────────────────────────
  // Single HTTP call → POST /admin/reset.  The backend performs the full
  // operation in ONE transaction:
  //   1. requireAdmin() check once (before any deletion)
  //   2. deleteAllInBatch() in reverse FK order via repositories (no re-auth)
  //   3. Re-seed: tipousuario, rolusuario, club, 3 usuarios
  // This avoids the 401 that occurs when sequential empty() calls lose the
  // admin user from the DB mid-way through the reset sequence.

  async runResetAll(): Promise<void> {
    if (this.running()) return;
    this.running.set(true);
    this.clearLogs();

    this.log('Ejecutando reset completo (una sola transacción en el servidor)...');
    this.log(`Orden de borrado: ${EMPTY_ORDER.map((k) => ENTITY_META[k].label).join(' → ')}`);

    try {
      const n = await firstValueFrom(this.svc.reset());
      this.log(`  ✓ Reset completado. Registros creados en seed: ${n}`);
      this.log('    · Tipo Usuario: 1-Administrador, 2-Administrador de equipo, 3-Usuario');
      this.log('    · Rol Usuario:  1-Presidente');
      this.log('    · Club:         1-Gesportin');
      this.log('    · Usuarios:     admin / clubadmin / usuario  (contraseña: ausias)');
      this.log('La aplicación conserva los datos mínimos del sistema.');
    } catch (err) {
      this.log(`ERROR en reset: ${this.errMsg(err)}`);
    } finally {
      this.running.set(false);
      await this.loadCounts();
    }
  }

  // ── Helpers ─────────────────────────────────────────────────────────────────

  private log(msg: string): void {
    this.logs.update((prev) => [...prev, msg]);
  }

  private clearLogs(): void {
    this.logs.set([]);
  }

  private errMsg(err: unknown): string {
    if (!err || typeof err !== 'object') return String(err ?? 'Error desconocido');
    const e = err as Record<string, unknown>;
    const nested = e['error'];
    if (nested && typeof nested === 'object') {
      const ne = nested as Record<string, unknown>;
      if (typeof ne['message'] === 'string') return ne['message'];
    }
    if (typeof nested === 'string') return nested;
    if (typeof e['message'] === 'string') return e['message'];
    if (typeof e['status'] === 'number') return `HTTP ${e['status']}`;
    return JSON.stringify(err);
  }
}
