import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArticuloTeamadminDetail } from '../../../../component/articulo/teamadmin/detail/detail';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';
import { ArticuloService } from '../../../../service/articulo';

@Component({
  selector: 'app-articulo-teamadmin-view-page',
  imports: [ArticuloTeamadminDetail, BreadcrumbComponent],
  template: '<app-breadcrumb [items]=\"breadcrumbItems()\"></app-breadcrumb><app-articulo-teamadmin-detail [id]="id_articulo"></app-articulo-teamadmin-detail>',
})
export class ArticuloTeamadminViewPage implements OnInit {
  breadcrumbItems = signal<BreadcrumbItem[]>([
    { label: 'Mis Clubes', route: '/club/teamadmin' },
    { label: 'Tipos de Artículo', route: '/tipoarticulo/teamadmin' },
    { label: 'Artículos', route: '/articulo/teamadmin' },
    { label: 'Artículo' },
  ]);

  private route = inject(ActivatedRoute);
  private articuloService = inject(ArticuloService);
  id_articulo = signal<number>(0);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const n = id ? Number(id) : NaN;
    this.id_articulo.set(n);
    if (!isNaN(n)) {
      this.articuloService.get(n).subscribe({
        next: (art) => {
          const tipo = art.tipoarticulo;
          const items: BreadcrumbItem[] = [{ label: 'Mis Clubes', route: '/club/teamadmin' }];
          if (tipo?.club) {
            items.push({ label: tipo.club.nombre, route: `/club/teamadmin/view/${tipo.club.id}` });
          }
          items.push({ label: 'Tipos de Artículo', route: '/tipoarticulo/teamadmin' });
          if (tipo) {
            items.push({ label: tipo.descripcion, route: `/tipoarticulo/teamadmin/view/${tipo.id}` });
          }
          items.push({ label: 'Artículos', route: tipo ? `/articulo/teamadmin/tipoarticulo/${tipo.id}` : '/articulo/teamadmin' });
          items.push({ label: art.descripcion });
          this.breadcrumbItems.set(items);
        },
        error: () => {},
      });
    }
  }
}
