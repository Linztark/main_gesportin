import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ITemporada } from '../model/temporada';
import { IPage } from '../model/plist';
import { serverURL } from '../environment/environment';
import { PayloadSanitizerService } from './payload-sanitizer';
import { IClub } from '../model/club';

@Injectable({
  providedIn: 'root',
})
export class TemporadaService {
  constructor(private oHttp: HttpClient, private sanitizer: PayloadSanitizerService) {}

  get(id: number): Observable<ITemporada> {
    return this.oHttp.get<ITemporada>(`${serverURL}/temporada/${id}`);
  }

  getPage(
    page: number,
    rpp: number,
    order: string = '',
    direction: string = '',
    descripcion: string = '',
    id_club: number = 0,
  ): Observable<IPage<ITemporada>> {
    if (order === '') {
      order = 'id';
    }
    if (direction === '') {
      direction = 'asc';
    }
    // Agregar ID como criterio secundario de ordenamiento
    const sortParams =
      order === 'id' ? `${order},${direction}` : `${order},${direction}&sort=id,asc`;

    if (id_club > 0) {
      return this.oHttp.get<IPage<ITemporada>>(
        serverURL + `/temporada?page=${page}&size=${rpp}&sort=${sortParams}&id_club=${id_club}`,
      );
    }

    if (descripcion && descripcion.length > 0) {
      return this.oHttp.get<IPage<ITemporada>>(
        serverURL +
          `/temporada?page=${page}&size=${rpp}&sort=${sortParams}&descripcion=${descripcion}`,
      );
    }

    return this.oHttp.get<IPage<ITemporada>>(
      serverURL + `/temporada?page=${page}&size=${rpp}&sort=${sortParams}`,
    );
  }

  update(temporada: Partial<ITemporada> & { club?: Partial<IClub> }): Observable<ITemporada> {
    const body = this.sanitizer.sanitize(temporada, { nestedIdFields: ['club'], removeFields: ['categorias'] });
    return this.oHttp.put<ITemporada>(`${serverURL}/temporada`, body);
  }

  create(temporada: Partial<ITemporada> & { club?: Partial<IClub> }): Observable<ITemporada> {
    const body = this.sanitizer.sanitize(temporada, { nestedIdFields: ['club'], removeFields: ['categorias'] });
    return this.oHttp.post<ITemporada>(`${serverURL}/temporada`, body);
  }


  count(): Observable<number> {
    return this.oHttp.get<number>(serverURL + '/temporada/count');
  }

  delete(id: number): Observable<number> {
    return this.oHttp.delete<number>(serverURL + '/temporada/' + id);
  }


}
