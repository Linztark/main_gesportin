import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { serverURL } from '../environment/environment';
import { PayloadSanitizerService } from './payload-sanitizer';
import { IPage } from '../model/plist';
import { Observable } from 'rxjs';
import { INoticia } from '../model/noticia';
import { SecurityService } from './security.service';

@Injectable({
  providedIn: 'root',
})
export class NoticiaService {
  constructor(
    private oHttp: HttpClient,
    private sanitizer: PayloadSanitizerService,
    private security: SecurityService,
  ) {}


  update(noticia: any): Observable<number> {
    if (this.security.isClubAdmin()) {
      const myClubId = this.security.getClubId();
      noticia.club = { id: myClubId };
      this.security.ensureClubOwnership(myClubId);
    } else {
      this.security.ensureClubOwnership(noticia.club?.id);
    }
    const body = this.sanitizer.sanitize(noticia, { nestedIdFields: ['club'], removeFields: ['comentarios', 'puntuaciones'] });
    return this.oHttp.put<number>(serverURL + '/noticia', body);
  }

  getPage(
    page: number,
    rpp: number,
    order: string = '',
    direction: string = '',
    titulo: string = '',
    id_club: number = 0,
  ): Observable<IPage<INoticia>> {
    if (order === '') {
      order = 'id';
    }
    if (direction === '') {
      direction = 'asc';
    }

    id_club = this.security.clubFilter(id_club);

    // Filtro por club.id
    if (id_club > 0) {
      return this.oHttp.get<IPage<INoticia>>(
        serverURL +
          `/noticia?page=${page}&size=${rpp}&sort=${order},${direction}&id_club=${id_club}`,
      );
    }

    // Búsqueda por título o contenido (usa el mismo valor para ambos campos)
    if (titulo && titulo.length > 0) {
      return this.oHttp.get<IPage<INoticia>>(
        serverURL +
          `/noticia?page=${page}&size=${rpp}&sort=${order},${direction}&titulo=${titulo}&contenido=${titulo}`,
      );
    }

    // Sin filtros
    return this.oHttp.get<IPage<INoticia>>(
      serverURL + `/noticia?page=${page}&size=${rpp}&sort=${order},${direction}`,
    );
  }

  getById(id: number): Observable<INoticia> {
    return this.oHttp.get<INoticia>(serverURL + `/noticia/${id}`);
  }

  //create
  create(noticia: INoticia): Observable<number> {
    if (this.security.isClubAdmin()) {
      const myClubId = this.security.getClubId();
      noticia.club = { id: myClubId } as any;
      this.security.ensureClubOwnership(myClubId);
    } else {
      this.security.ensureClubOwnership(noticia.club?.id);
    }
    const body = this.sanitizer.sanitize(noticia, { nestedIdFields: ['club'], removeFields: ['comentarios', 'puntuaciones'] });
    return this.oHttp.post<number>(serverURL + '/noticia', body);
  }

  count(): Observable<number> {
    return this.oHttp.get<number>(serverURL + '/noticia/count');
  }

  delete(id: number): Observable<number> {
    return this.oHttp.delete<number>(serverURL + '/noticia/' + id);
  }
}
