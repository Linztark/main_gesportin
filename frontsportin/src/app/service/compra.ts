import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPage } from '../model/plist';
import { serverURL } from '../environment/environment';
import { ICompra } from '../model/compra';
import { PayloadSanitizerService } from './payload-sanitizer';

@Injectable({
  providedIn: 'root',
})
export class CompraService {
  constructor(
    private oHttp: HttpClient,
    private sanitizer: PayloadSanitizerService,
  ) {}

  getPage(
    page: number,
    rpp: number,
    order: string = '',
    direction: string = '',
    id_articulo: number = 0,
    id_factura: number = 0,
  ): Observable<IPage<ICompra>> {
    if (order === '') {
      order = 'id';
    }
    if (direction === '') {
      direction = 'asc';
    }
    const params = `?page=${page}&size=${rpp}&sort=${order},${direction}${
      id_articulo > 0 ? `&id_articulo=${id_articulo}` : ''
    }${id_factura > 0 ? `&id_factura=${id_factura}` : ''}`;

    return this.oHttp.get<IPage<ICompra>>(serverURL + `/compra` + params);
  }

  get(id: number): Observable<ICompra> {
    return this.oHttp.get<ICompra>(`${serverURL}/compra/${id}`);
  }

  count(): Observable<number> {
    return this.oHttp.get<number>(serverURL + '/compra/count');
  }
  create(compra: Partial<ICompra>): Observable<number> {
      return this.oHttp.post<number>(serverURL + '/compra', compra);
    }

  delete(id: number): Observable<number> {
    return this.oHttp.delete<number>(serverURL + '/compra/' + id);
  }

  update(compra: Partial<ICompra>): Observable<number> {
    const body = this.sanitizer.sanitize(compra, { nestedIdFields: ['articulo', 'factura'] });
    return this.oHttp.put<number>(serverURL + '/compra', body);
  }

}
