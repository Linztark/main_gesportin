import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CarritoTeamadminDetail } from '../../../../component/carrito/teamadmin/detail/detail';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';
import { CarritoService } from '../../../../service/carrito';

@Component({
  selector: 'app-carrito-teamadmin-view-page',
  imports: [CarritoTeamadminDetail, BreadcrumbComponent],
  template: '<app-breadcrumb [items]=\"breadcrumbItems()\"></app-breadcrumb><app-carrito-teamadmin-detail [id]="id_carrito"></app-carrito-teamadmin-detail>',
})
export class CarritoTeamadminViewPage implements OnInit {
  breadcrumbItems = signal<BreadcrumbItem[]>([
    { label: 'Mis Clubes', route: '/club/teamadmin' },
    { label: 'Tipos de Artículo', route: '/tipoarticulo/teamadmin' },
    { label: 'Artículos', route: '/articulo/teamadmin' },
    { label: 'Carritos', route: '/carrito/teamadmin' },
    { label: 'Carrito' },
  ]);

  private route = inject(ActivatedRoute);
  private carritoService = inject(CarritoService);
  id_carrito = signal<number>(0);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const n = id ? Number(id) : NaN;
    this.id_carrito.set(n);
    if (!isNaN(n)) {
      this.carritoService.get(n).subscribe({
        next: (car) => {
          const art = car.articulo;
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
          items.push({ label: 'Carritos', route: art ? `/carrito/teamadmin/articulo/${art.id}` : '/carrito/teamadmin' });
          items.push({ label: 'Carrito' });
          this.breadcrumbItems.set(items);
        },
        error: () => {},
      });
    }
  }
}
