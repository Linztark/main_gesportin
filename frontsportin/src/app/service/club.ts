import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { serverURL } from '../environment/environment';
import { IClub } from '../model/club';
import { IPage } from '../model/plist';
import { PayloadSanitizerService } from './payload-sanitizer';

@Injectable({
  providedIn: 'root'
})
export class ClubService {

  private http = inject(HttpClient);
  private sanitizer = inject(PayloadSanitizerService);
  private url = `${serverURL}/club`;

  get(id: number): Observable<IClub> {
    return this.http.get<IClub>(`${this.url}/${id}`);
  }

  getPage(
    page: number,
    size: number,
    sort: string = 'id',
    direction: string = 'asc'
  ): Observable<IPage<IClub>> {
    return this.http.get<IPage<IClub>>(
      `${this.url}?page=${page}&size=${size}&sort=${sort},${direction}`
    );
  }

  count(): Observable<number> {
    return this.http.get<number>(`${this.url}/count`);
  }

  delete(id: number): Observable<number> {
    return this.http.delete<number>(`${this.url}/${id}`);
  }
     update(club: Partial<IClub>): Observable<number> {
     const body = this.sanitizer.sanitize(club);
     return this.http.put<number>(serverURL + '/club', body);
   }
  // create
  create(club: IClub): Observable<number> {
    const body = this.sanitizer.sanitize(club);
    return this.http.post<number>(serverURL + '/club', body);
  }
}
