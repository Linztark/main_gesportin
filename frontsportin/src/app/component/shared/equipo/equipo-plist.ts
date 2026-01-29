import { Component, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { rpp as RPP, rpp } from '../../../environment/environment';
import { EquipoService } from '../../../service/equipo';
import { IEquipo } from '../../../model/equipo';
import { IPage } from '../../../model/plist';
import { Paginacion } from '../../shared/paginacion/paginacion';
import { BotoneraRpp } from '../../shared/botonera-rpp/botonera-rpp';

@Component({
  selector: 'app-plist-equipo',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, Paginacion, BotoneraRpp],
  templateUrl: './equipo-plist.html',
  styleUrls: ['./equipo-plist.css'],
})
export class PlistEquipo {
  private cd: ChangeDetectorRef = inject(ChangeDetectorRef);
  private equipoService: EquipoService = inject(EquipoService as any);

  aEquipos: IEquipo[] = [];
  pageNumber: number = 0;
  pageSize: number = 10;
  totalPages: number = 1;
  totalElements: number = 0;
  sort: string = 'id,asc';

  rpp = RPP;

  loading: boolean = false;
  error: string | null = null;
  searchTerm: string = '';
  // When true we assume the backend is doing the global filtering and
  // page/total values returned by the server reflect the search.
  serverSearchActive: boolean = false;

  ngOnInit() {
    this.loadPage();
  }

  loadPage(page: number = this.pageNumber) {
    this.loading = true;
    this.error = null;
    this.equipoService.getPage(page, this.pageSize, 'id', 'asc', this.searchTerm).subscribe({
      next: (res: IPage<IEquipo>) => {
        this.aEquipos = res.content || [];
        this.pageNumber = res.number || 0;
        this.pageSize = res.size || this.pageSize;
        this.totalPages = res.totalPages || 1;
        this.totalElements = res.totalElements || 0;
        this.loading = false;
        try { this.cd.detectChanges(); } catch (e) { }
      },
      error: (err: any) => {
        this.loading = false;
        this.error = err?.message || ('Error ' + err?.status || 'Unknown');
        console.error('Error cargando equipos', err);
      }
    });
  }

  onSearch() {
    // start search from first page
    this.pageNumber = 0;
    this.serverSearchActive = (String(this.searchTerm || '').trim().length > 0);
    this.loadPage(0);
  }

  // Client-side filter for the current page results
  getFilteredEquipos(): IEquipo[] {
    // If server search is active we rely on the backend to return only the
    // matching items for the current page, so we must not apply an extra
    // client-side filter (it would shrink the shown rows and break paging).
    if (this.serverSearchActive) {
      return this.aEquipos;
    }

    const q = (this.searchTerm || '').toString().trim().toLowerCase();
    if (!q) return this.aEquipos;
    return this.aEquipos.filter((e: IEquipo) => {
      const parts = [
        (e.id ?? '').toString(),
        e.nombre ?? '',
        e.categoria?.nombre ?? '',
        (e.categoria?.id ?? '').toString(),
        e.entrenador?.nombre ?? '',
        e.entrenador?.apellido1 ?? '',
        (e.jugadores ?? '').toString()
      ];
      return parts.join(' ').toLowerCase().includes(q);
    });
  }

  onPageChange(newPage: number) {
    if (newPage < 0) return;
    if (this.totalPages != null && newPage >= this.totalPages) return;
    this.loadPage(newPage);
  }

  getPages(): number[] {
    const pages: number[] = [];
    for (let i = 0; i < this.totalPages; i++) pages.push(i);
    return pages;
  }

  onSizeChange(value: any) {
    this.pageSize = Number(value);
    this.loadPage(0);
  }

}
