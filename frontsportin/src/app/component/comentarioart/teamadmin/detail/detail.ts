import { Component, signal, OnInit, inject, Input, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { DatetimePipe } from '../../../../pipe/datetime-pipe';
import { ComentarioartService } from '../../../../service/comentarioart';
import { IComentarioart } from '../../../../model/comentarioart';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../shared/breadcrumb/breadcrumb';

@Component({
  standalone: true,
  selector: 'app-comentarioart-teamadmin-detail',
  imports: [CommonModule, RouterLink, DatetimePipe, BreadcrumbComponent],
  templateUrl: './detail.html',
  styleUrl: './detail.css',
})
export class ComentarioartTeamadminDetail implements OnInit {
  @Input() id: Signal<number> = signal(0);

  private comentarioartService = inject(ComentarioartService);

  oComentarioart = signal<IComentarioart | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  breadcrumbItems = signal<BreadcrumbItem[]>([
    { label: 'Mis Clubes', route: '/club/teamadmin' },
    { label: 'Tipos de Artículos', route: '/tipoarticulo/teamadmin' },
    { label: 'Artículos', route: '/articulo/teamadmin' },
    { label: 'Comentarios de Artículo', route: '/comentarioart/teamadmin' },
    { label: 'Comentario' },
  ]);

  ngOnInit(): void {
    const idComentarioart = this.id();
    if (!idComentarioart || isNaN(idComentarioart)) {
      this.error.set('ID de comentario no válido');
      this.loading.set(false);
      return;
    }
    this.load(idComentarioart);
  }

  private load(id: number): void {
    this.comentarioartService.get(id).subscribe({
      next: (data) => {
        this.oComentarioart.set(data);
        this.loading.set(false);
        const art = data.articulo;
        const tipo = art?.tipoarticulo;
        this.breadcrumbItems.set([
          { label: 'Mis Clubes', route: '/club/teamadmin' },
          { label: 'Tipos de Artículos', route: '/tipoarticulo/teamadmin' },
          ...(tipo ? [{ label: tipo.descripcion, route: `/tipoarticulo/teamadmin/view/${tipo.id}` }] : []),
          { label: 'Artículos', route: tipo ? `/articulo/teamadmin/tipoarticulo/${tipo.id}` : '/articulo/teamadmin' },
          ...(art ? [{ label: art.descripcion, route: `/articulo/teamadmin/view/${art.id}` }] : []),
          { label: 'Comentarios de Artículo', route: art ? `/comentarioart/teamadmin/articulo/${art.id}` : '/comentarioart/teamadmin' },
          { label: `#${data.id}` },
        ]);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando el comentario');
        console.error(err);
        this.loading.set(false);
      },
    });
  }
}
