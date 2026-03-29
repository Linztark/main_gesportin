import { Injectable } from '@angular/core';
import { ICuota } from '../model/cuota';
import { Observable } from 'rxjs';
import { IPage } from '../model/plist';
import { HttpClient } from '@angular/common/http';
import { serverURL } from '../environment/environment';
import { PayloadSanitizerService } from './payload-sanitizer';

@Injectable({
  providedIn: 'root',
})
export class CuotaService {
  constructor(
    private oHttp: HttpClient,
    private sanitizer: PayloadSanitizerService,
  ) {}

  getPage(
    page: number,
    rpp: number,
    order: string = '',
    direction: string = '',
    descripcion: string = '',
    id_equipo: number = 0,
  ): Observable<IPage<ICuota>> {
    // we could filter by equipo belonging to club; require backend assistance
    if (order === '') {
      order = 'id';
    }
    if (direction === '') {
      direction = 'asc';
    }
    if (id_equipo > 0) {
      return this.oHttp.get<IPage<ICuota>>(
        serverURL +
          `/cuota?page=${page}&size=${rpp}&sort=${order},${direction}&id_equipo=${id_equipo}`,
      );
    }
    if (descripcion && descripcion.length > 0) {
      return this.oHttp.get<IPage<ICuota>>(
        serverURL +
          `/cuota?page=${page}&size=${rpp}&sort=${order},${direction}&descripcion=${descripcion}`,
      );
    }
    return this.oHttp.get<IPage<ICuota>>(
      serverURL + `/cuota?page=${page}&size=${rpp}&sort=${order},${direction}`,
    );
  }

  get(id: number): Observable<ICuota> {
    return this.oHttp.get<ICuota>(serverURL + '/cuota/' + id);
  }

  // create(cuota: Partial<ICuota>): Observable<number> {
  //   return this.oHttp.post<number>(serverURL + '/cuota', cuota);
  // }
  create(cuota: Partial<ICuota>): Observable<number> {
    const body = this.sanitizer.sanitize(cuota, { nestedIdFields: ['equipo'], removeFields: ['pagos'] });
    return this.oHttp.post<number>(serverURL + '/cuota', body);
  }

  update(cuota: Partial<ICuota>): Observable<number> {
    const body = this.sanitizer.sanitize(cuota, { nestedIdFields: ['equipo'], removeFields: ['pagos'] });
    return this.oHttp.put<number>(serverURL + '/cuota', body);
  }

  delete(id: number): Observable<number> {
    return this.oHttp.delete<number>(serverURL + '/cuota/' + id);
  }

  // empty(): Observable<number> {
  //   return this.oHttp.delete<number>(serverURL + '/cuota/empty');
  // }

  count(): Observable<number> {
    return this.oHttp.get<number>(serverURL + '/cuota/count');
  }
}
