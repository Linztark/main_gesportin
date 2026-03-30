import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { serverURL } from '../environment/environment';

export type DataEntityKey =
  | 'tipousuario'
  | 'rolusuario'
  | 'club'
  | 'usuario'
  | 'temporada'
  | 'noticia'
  | 'tipoarticulo'
  | 'categoria'
  | 'articulo'
  | 'equipo'
  | 'liga'
  | 'jugador'
  | 'cuota'
  | 'partido'
  | 'pago'
  | 'comentario'
  | 'puntuacion'
  | 'comentarioart'
  | 'carrito'
  | 'factura'
  | 'compra';

export interface IEntityMeta {
  key: DataEntityKey;
  label: string;
  /** Whether the fill endpoint accepts ?/fill/{cantidad} or just /fill (no amount). */
  fixedFill: boolean;
}

/** Creation order respecting FK dependencies. */
export const FILL_ORDER: readonly DataEntityKey[] = [
  'tipousuario',
  'rolusuario',
  'club',
  'usuario',
  'temporada',
  'noticia',
  'tipoarticulo',
  'categoria',
  'articulo',
  'equipo',
  'liga',
  'jugador',
  'cuota',
  'partido',
  'pago',
  'comentario',
  'puntuacion',
  'comentarioart',
  'carrito',
  'factura',
  'compra',
];

/** Safe deletion order = reverse of creation order. */
export const EMPTY_ORDER: readonly DataEntityKey[] = [...FILL_ORDER].reverse();

export const ENTITY_META: Record<DataEntityKey, IEntityMeta> = {
  tipousuario: { key: 'tipousuario', label: 'Tipo de Usuario', fixedFill: true },
  rolusuario: { key: 'rolusuario', label: 'Rol de Usuario', fixedFill: true },
  club: { key: 'club', label: 'Club', fixedFill: false },
  usuario: { key: 'usuario', label: 'Usuario', fixedFill: false },
  temporada: { key: 'temporada', label: 'Temporada', fixedFill: false },
  noticia: { key: 'noticia', label: 'Noticia', fixedFill: false },
  tipoarticulo: { key: 'tipoarticulo', label: 'Tipo de Artículo', fixedFill: false },
  categoria: { key: 'categoria', label: 'Categoría', fixedFill: false },
  articulo: { key: 'articulo', label: 'Artículo', fixedFill: false },
  equipo: { key: 'equipo', label: 'Equipo', fixedFill: false },
  liga: { key: 'liga', label: 'Liga', fixedFill: false },
  jugador: { key: 'jugador', label: 'Jugador', fixedFill: false },
  cuota: { key: 'cuota', label: 'Cuota', fixedFill: false },
  partido: { key: 'partido', label: 'Partido', fixedFill: false },
  pago: { key: 'pago', label: 'Pago', fixedFill: false },
  comentario: { key: 'comentario', label: 'Comentario', fixedFill: false },
  puntuacion: { key: 'puntuacion', label: 'Puntuación', fixedFill: false },
  comentarioart: { key: 'comentarioart', label: 'Comentario de Artículo', fixedFill: false },
  carrito: { key: 'carrito', label: 'Carrito', fixedFill: false },
  factura: { key: 'factura', label: 'Factura', fixedFill: false },
  compra: { key: 'compra', label: 'Compra', fixedFill: false },
};

@Injectable({
  providedIn: 'root',
})
export class AdminDataToolsService {
  private http = inject(HttpClient);

  // ── Counts ──────────────────────────────────────────────────────────────────

  count(entity: DataEntityKey): Observable<number> {
    return this.http.get<number>(`${serverURL}/${entity}/count`);
  }

  // ── Fill ────────────────────────────────────────────────────────────────────

  fill(entity: DataEntityKey, amount: number): Observable<number> {
    const meta = ENTITY_META[entity];
    if (meta.fixedFill) {
      // tipousuario → GET /tipousuario/fill  |  rolusuario → POST /rolusuario/fill
      const method = entity === 'tipousuario' ? 'get' : 'post';
      if (method === 'get') {
        return this.http.get<number>(`${serverURL}/${entity}/fill`);
      }
      return this.http.post<number>(`${serverURL}/${entity}/fill`, null);
    }
    return this.http.post<number>(`${serverURL}/${entity}/fill/${amount}`, null);
  }

  // ── Empty ───────────────────────────────────────────────────────────────────

  empty(entity: DataEntityKey): Observable<number> {
    return this.http.delete<number>(`${serverURL}/${entity}/empty`);
  }

  // ── Seed (minimum required system data, idempotent) ───────────────────────

  seed(): Observable<number> {
    return this.http.post<number>(`${serverURL}/admin/seed`, null);
  }

  // ── Reset (single transactional operation: empty all + seed) ────────────────

  reset(): Observable<number> {
    return this.http.post<number>(`${serverURL}/admin/reset`, null);
  }
}
