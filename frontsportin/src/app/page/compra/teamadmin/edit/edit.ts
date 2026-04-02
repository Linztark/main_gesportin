import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CompraTeamadminForm } from '../../../../component/compra/teamadmin/form/form';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';
import { CompraService } from '../../../../service/compra';

@Component({
  selector: 'app-compra-teamadmin-edit-page',
  imports: [CompraTeamadminForm, BreadcrumbComponent],
  template: '<app-breadcrumb [items]=\"breadcrumbItems()\"></app-breadcrumb><app-compra-teamadmin-form [id]="id_compra()" [returnUrl]="returnUrl"></app-compra-teamadmin-form>',
})
export class CompraTeamadminEditPage implements OnInit {
  breadcrumbItems = signal<BreadcrumbItem[]>([
    { label: 'Mis Clubes', route: '/club/teamadmin' },
    { label: 'Tipos de Artículo', route: '/tipoarticulo/teamadmin' },
    { label: 'Artículos', route: '/articulo/teamadmin' },
    { label: 'Compras', route: '/compra/teamadmin' },
    { label: 'Editar Compra' },
  ]);

  private route = inject(ActivatedRoute);
  private compraService = inject(CompraService);
  id_compra = signal<number>(0);
  returnUrl = '/compra/teamadmin';

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
          items.push({ label: 'Editar Compra' });
          this.breadcrumbItems.set(items);
        },
        error: () => {},
      });
    }
  }
}
