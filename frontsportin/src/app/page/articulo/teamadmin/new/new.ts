import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArticuloTeamadminForm } from '../../../../component/articulo/teamadmin/form/form';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';
import { TipoarticuloService } from '../../../../service/tipoarticulo';

@Component({
  selector: 'app-articulo-teamadmin-new-page',
  imports: [ArticuloTeamadminForm, BreadcrumbComponent],
  template: '<app-breadcrumb [items]=\"breadcrumbItems()\"></app-breadcrumb><app-articulo-teamadmin-form [returnUrl]="returnUrl" [idTipoarticulo]="idTipoarticulo()"></app-articulo-teamadmin-form>',
})
export class ArticuloTeamadminNewPage implements OnInit {
  breadcrumbItems = signal<BreadcrumbItem[]>([
    { label: 'Mis Clubes', route: '/club/teamadmin' },
    { label: 'Tipos de Artículo', route: '/tipoarticulo/teamadmin' },
    { label: 'Artículos', route: '/articulo/teamadmin' },
    { label: 'Nuevo Artículo' },
  ]);

  private route = inject(ActivatedRoute);
  private tipoarticuloService = inject(TipoarticuloService);
  returnUrl = '/articulo/teamadmin';
  idTipoarticulo = signal<number>(0);

  ngOnInit(): void {
    const val = this.route.snapshot.queryParamMap.get('id_tipoarticulo');
    if (val) {
      const n = Number(val);
      this.idTipoarticulo.set(n);
      this.tipoarticuloService.get(n).subscribe({
        next: (tipo) => {
          const items: BreadcrumbItem[] = [{ label: 'Mis Clubes', route: '/club/teamadmin' }];
          if (tipo.club) {
            items.push({ label: tipo.club.nombre, route: `/club/teamadmin/view/${tipo.club.id}` });
          }
          items.push({ label: 'Tipos de Artículo', route: '/tipoarticulo/teamadmin' });
          items.push({ label: tipo.descripcion, route: `/tipoarticulo/teamadmin/view/${tipo.id}` });
          items.push({ label: 'Artículos', route: `/articulo/teamadmin/tipoarticulo/${tipo.id}` });
          items.push({ label: 'Nuevo Artículo' });
          this.breadcrumbItems.set(items);
        },
        error: () => {},
      });
    }
  }
}
