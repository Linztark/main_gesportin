import { Injectable } from '@angular/core';
import { IEquipo } from '../model/equipo';
import { Observable } from 'rxjs';
import { IPage } from '../model/plist';
import { HttpClient } from '@angular/common/http';
import { serverURL } from '../environment/environment';
import { PayloadSanitizerService } from './payload-sanitizer';

@Injectable({
  providedIn: 'root',
})
export class EquipoService {
  constructor(private oHttp: HttpClient, private sanitizer: PayloadSanitizerService) { }

  getPage(
    page: number,
    rpp: number,
    order: string = '',
    direction: string = '',
    nombre: string = '',
    id_categoria: number = 0,
    id_usuario: number = 0,
  ): Observable<IPage<IEquipo>> {
    if (order === '') {
      order = 'id';
    }
    if (direction === '') {
      direction = 'asc';
    }

    // Construir la URL incluyendo solo los parámetros esperados por la API
    // Búsqueda por nombre (parametro 'nombre') y filtros por id_categoria e id_usuario
    let url = serverURL + `/equipo?page=${page}&size=${rpp}&sort=${order},${direction}`;

    if (nombre && nombre.length > 0) {
      url += `&nombre=${encodeURIComponent(nombre)}`;
    }

    if (id_categoria && id_categoria > 0) {
      url += `&id_categoria=${id_categoria}`;
    }

    if (id_usuario && id_usuario > 0) {
      url += `&id_usuario=${id_usuario}`;
    }

    return this.oHttp.get<IPage<IEquipo>>(url);
  }

  get(id: number): Observable<IEquipo> {
    return this.oHttp.get<IEquipo>(serverURL + '/equipo/' + id);
  }

  create(equipo: Partial<IEquipo>): Observable<number> {
    const body = this.sanitizer.sanitize(equipo, {
      nestedIdFields: ['categoria', 'entrenador'],
      removeFields: ['jugadores', 'cuotas', 'ligas'],
    });
    return this.oHttp.post<number>(serverURL + '/equipo', body);
  }

  update(equipo: Partial<IEquipo>): Observable<number> {
    const body = this.sanitizer.sanitize(equipo, {
      nestedIdFields: ['categoria', 'entrenador'],
      removeFields: ['jugadores', 'cuotas', 'ligas'],
    });
    return this.oHttp.put<number>(`${serverURL}/equipo`, body);
  }

  delete(id: number): Observable<number> {
    return this.oHttp.delete<number>(serverURL + '/equipo/' + id);
  }

  // empty(): Observable<number> {
  //   return this.oHttp.delete<number>(serverURL + '/equipo/empty');
  // }

  count(): Observable<number> {
    return this.oHttp.get<number>(serverURL + '/equipo/count');
  }
}
