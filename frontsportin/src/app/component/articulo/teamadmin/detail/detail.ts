import { Component, signal, OnInit, inject, Input, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { DatetimePipe } from '../../../../pipe/datetime-pipe';
import { ArticuloService } from '../../../../service/articulo';
import { IArticulo } from '../../../../model/articulo';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../shared/breadcrumb/breadcrumb';

@Component({
  standalone: true,
  selector: 'app-articulo-teamadmin-detail',
  imports: [CommonModule, RouterLink, DatetimePipe, BreadcrumbComponent],
  templateUrl: './detail.html',
  styleUrl: './detail.css',
})
export class ArticuloTeamadminDetail implements OnInit {
  @Input() id: Signal<number> = signal(0);

  private articuloService = inject(ArticuloService);

  oArticulo = signal<IArticulo | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  breadcrumbItems = signal<BreadcrumbItem[]>([
    { label: 'Mis Clubes', route: '/club/teamadmin' },
    { label: 'Tipos de Artículos', route: '/tipoarticulo/teamadmin' },
    { label: 'Artículos', route: '/articulo/teamadmin' },
    { label: 'Artículo' },
  ]);

  ngOnInit(): void {
    const idArticulo = this.id();
    if (!idArticulo || isNaN(idArticulo)) {
      this.error.set('ID de artículo no válido');
      this.loading.set(false);
      return;
    }
    this.load(idArticulo);
  }

  private load(id: number): void {
    this.articuloService.get(id).subscribe({
      next: (data) => {
        this.oArticulo.set(data);
        this.loading.set(false);
        const tipo = data.tipoarticulo;
        this.breadcrumbItems.set([
          { label: 'Mis Clubes', route: '/club/teamadmin' },
          { label: 'Tipos de Artículos', route: '/tipoarticulo/teamadmin' },
          ...(tipo ? [{ label: tipo.descripcion, route: `/tipoarticulo/teamadmin/view/${tipo.id}` }] : []),
          { label: 'Artículos', route: tipo ? `/articulo/teamadmin/tipoarticulo/${tipo.id}` : '/articulo/teamadmin' },
          { label: data.descripcion },
        ]);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando el artículo');
        console.error(err);
        this.loading.set(false);
      },
    });
  }
}
