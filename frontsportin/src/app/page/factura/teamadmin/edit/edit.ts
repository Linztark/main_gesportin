import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FacturaTeamadminForm } from '../../../../component/factura/teamadmin/form/form';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';
import { FacturaService } from '../../../../service/factura-service';

@Component({
  selector: 'app-factura-teamadmin-edit-page',
  imports: [FacturaTeamadminForm, BreadcrumbComponent],
  template: '<app-breadcrumb [items]=\"breadcrumbItems()\"></app-breadcrumb><app-factura-teamadmin-form [id]="id_factura()" [returnUrl]="returnUrl"></app-factura-teamadmin-form>',
})
export class FacturaTeamadminEditPage implements OnInit {
  breadcrumbItems = signal<BreadcrumbItem[]>([
    { label: 'Mis Clubes', route: '/club/teamadmin' },
    { label: 'Usuarios', route: '/usuario/teamadmin' },
    { label: 'Facturas', route: '/factura/teamadmin' },
    { label: 'Editar Factura' },
  ]);

  private route = inject(ActivatedRoute);
  private facturaService = inject(FacturaService);
  id_factura = signal<number>(0);
  returnUrl = '/factura/teamadmin';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const n = id ? Number(id) : NaN;
    this.id_factura.set(n);
    if (!isNaN(n)) {
      this.facturaService.get(n).subscribe({
        next: (factura) => {
          const usuario = factura.usuario;
          const items: BreadcrumbItem[] = [{ label: 'Mis Clubes', route: '/club/teamadmin' }];
          if (usuario?.club) {
            items.push({ label: usuario.club.nombre, route: `/club/teamadmin/view/${usuario.club.id}` });
          }
          items.push({ label: 'Usuarios', route: '/usuario/teamadmin' });
          if (usuario) {
            items.push({ label: `${usuario.nombre} ${usuario.apellido1}`, route: `/usuario/teamadmin/view/${usuario.id}` });
          }
          items.push({ label: 'Facturas', route: usuario ? `/factura/teamadmin/usuario/${usuario.id}` : '/factura/teamadmin' });
          items.push({ label: 'Editar Factura' });
          this.breadcrumbItems.set(items);
        },
        error: () => {},
      });
    }
  }
}
