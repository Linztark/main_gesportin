import { Component, signal, OnInit, inject, Input, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { CategoriaService } from '../../../../service/categoria';
import { ICategoria } from '../../../../model/categoria';
import { DatetimePipe } from '../../../../pipe/datetime-pipe';
import { SessionService } from '../../../../service/session';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../shared/breadcrumb/breadcrumb';

@Component({
  selector: 'app-categoria-teamadmin-detail',
  imports: [CommonModule, RouterLink, DatetimePipe, BreadcrumbComponent],
  templateUrl: './detail.html',
  styleUrl: './detail.css',
})
export class CategoriaTeamadminDetail implements OnInit {

  @Input() id: Signal<number> = signal(0);

  private oCategoriaService = inject(CategoriaService);
  session = inject(SessionService);

  oCategoria = signal<ICategoria | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  breadcrumbItems = signal<BreadcrumbItem[]>([
    { label: 'Mis Clubes', route: '/club/teamadmin' },
    { label: 'Temporadas', route: '/temporada/teamadmin' },
    { label: 'Categorías', route: '/categoria/teamadmin' },
    { label: 'Categoría' },
  ]);

  ngOnInit(): void {
    this.load(this.id());
  }

  load(id: number) {
    this.oCategoriaService.get(id).subscribe({
      next: (data: ICategoria) => {
        this.oCategoria.set(data);
        this.loading.set(false);
        const temp = data.temporada;
        this.breadcrumbItems.set([
          { label: 'Mis Clubes', route: '/club/teamadmin' },
          { label: 'Temporadas', route: '/temporada/teamadmin' },
          ...(temp ? [{ label: temp.descripcion, route: `/temporada/teamadmin/view/${temp.id}` }] : []),
          { label: 'Categorías', route: temp ? `/categoria/teamadmin/temporada/${temp.id}` : '/categoria/teamadmin' },
          { label: data.nombre },
        ]);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando la categoría');
        this.loading.set(false);
        console.error(err);
      },
    });
  }
}
