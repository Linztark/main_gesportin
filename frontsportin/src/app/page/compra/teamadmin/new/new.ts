import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CompraTeamadminForm } from '../../../../component/compra/teamadmin/form/form';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';
import { ArticuloService } from '../../../../service/articulo';

@Component({
  selector: 'app-compra-teamadmin-new-page',
  imports: [CompraTeamadminForm, BreadcrumbComponent],
  template: '<app-breadcrumb [items]=\"breadcrumbItems()\"></app-breadcrumb><app-compra-teamadmin-form [returnUrl]="returnUrl" [idArticulo]="idArticulo()"></app-compra-teamadmin-form>',
})
export class CompraTeamadminNewPage implements OnInit {
  breadcrumbItems = signal<BreadcrumbItem[]>([
    { label: 'Mis Clubes', route: '/club/teamadmin' },
    { label: 'Tipos de Artículo', route: '/tipoarticulo/teamadmin' },
    { label: 'Artículos', route: '/articulo/teamadmin' },
    { label: 'Compras', route: '/compra/teamadmin' },
    { label: 'Nueva Compra' },
  ]);

  private route = inject(ActivatedRoute);
  private articuloService = inject(ArticuloService);
  returnUrl = '/compra/teamadmin';
  idArticulo = signal<number>(0);

  ngOnInit(): void {
    const val = this.route.snapshot.queryParamMap.get('id_articulo');
    if (val) {
      const n = Number(val);
      this.idArticulo.set(n);
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
          items.push({ label: art.descripcion, route: `/articulo/teamadmin/view/${art.id}` });
          items.push({ label: 'Compras', route: `/compra/teamadmin/articulo/${art.id}` });
          items.push({ label: 'Nueva Compra' });
          this.breadcrumbItems.set(items);
        },
        error: () => {},
      });
    }
  }
}
