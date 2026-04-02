import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ComentarioartTeamadminDetail } from '../../../../component/comentarioart/teamadmin/detail/detail';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';
import { ComentarioartService } from '../../../../service/comentarioart';

@Component({
  selector: 'app-comentarioart-teamadmin-view-page',
  imports: [ComentarioartTeamadminDetail, BreadcrumbComponent],
  template: '<app-breadcrumb [items]=\"breadcrumbItems()\"></app-breadcrumb><app-comentarioart-teamadmin-detail [id]="id_comentarioart"></app-comentarioart-teamadmin-detail>',
})
export class ComentarioartTeamadminViewPage implements OnInit {
  breadcrumbItems = signal<BreadcrumbItem[]>([
    { label: 'Mis Clubes', route: '/club/teamadmin' },
    { label: 'Tipos de Artículo', route: '/tipoarticulo/teamadmin' },
    { label: 'Artículos', route: '/articulo/teamadmin' },
    { label: 'Comentarios de Artículos', route: '/comentarioart/teamadmin' },
    { label: 'Comentario' },
  ]);

  private route = inject(ActivatedRoute);
  private comentarioartService = inject(ComentarioartService);
  id_comentarioart = signal<number>(0);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const n = id ? Number(id) : NaN;
    this.id_comentarioart.set(n);
    if (!isNaN(n)) {
      this.comentarioartService.get(n).subscribe({
        next: (com) => {
          const art = com.articulo;
          const tipo = art?.tipoarticulo;
          const items: BreadcrumbItem[] = [{ label: 'Mis Clubes', route: '/club/teamadmin' }];
          if (tipo?.club) {
            items.push({ label: tipo.club.nombre, route: `/club/teamadmin/view/${tipo.club.id}` });
          }
          items.push({ label: 'Tipos de Artículo', route: '/tipoarticulo/teamadmin' });
          if (tipo) {
            items.push({ label: tipo.descripcion, route: `/tipoarticulo/teamadmin/view/${tipo.id}` });
          }
          items.push({ label: 'Artículos', route: tipo ? `/articulo/teamadmin/tipoarticulo/${tipo.id}` : '/articulo/teamadmin' });
          if (art) {
            items.push({ label: art.descripcion, route: `/articulo/teamadmin/view/${art.id}` });
          }
          items.push({ label: 'Comentarios de Artículos', route: art ? `/comentarioart/teamadmin/articulo/${art.id}` : '/comentarioart/teamadmin' });
          items.push({ label: 'Comentario' });
          this.breadcrumbItems.set(items);
        },
        error: () => {},
      });
    }
  }
}
