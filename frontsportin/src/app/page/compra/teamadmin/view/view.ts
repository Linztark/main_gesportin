import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CompraTeamadminDetail } from '../../../../component/compra/teamadmin/detail/detail';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';
import { CompraService } from '../../../../service/compra';

@Component({
  selector: 'app-compra-teamadmin-view-page',
  imports: [CompraTeamadminDetail, BreadcrumbComponent],
  template: '<app-breadcrumb [items]=\"breadcrumbItems()\"></app-breadcrumb><app-compra-teamadmin-detail [id]="id_compra"></app-compra-teamadmin-detail>',
})
export class CompraTeamadminViewPage implements OnInit {
  breadcrumbItems = signal<BreadcrumbItem[]>([
    { label: 'Mis Clubes', route: '/club/teamadmin' },
    { label: 'Tipos de Artículo', route: '/tipoarticulo/teamadmin' },
    { label: 'Artículos', route: '/articulo/teamadmin' },
    { label: 'Compras', route: '/compra/teamadmin' },
    { label: 'Compra' },
  ]);

  private route = inject(ActivatedRoute);
  private compraService = inject(CompraService);
  id_compra = signal<number>(0);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const n = id ? Number(id) : NaN;
    this.id_compra.set(n);
    if (!isNaN(n)) {
      this.compraService.get(n).subscribe({
        next: (compra) => {
          const art = compra.articulo;
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
          items.push({ label: 'Compras', route: art ? `/compra/teamadmin/articulo/${art.id}` : '/compra/teamadmin' });
          items.push({ label: 'Compra' });
          this.breadcrumbItems.set(items);
        },
        error: () => {},
      });
    }
  }
}
