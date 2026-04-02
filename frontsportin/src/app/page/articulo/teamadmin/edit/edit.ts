import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArticuloTeamadminForm } from '../../../../component/articulo/teamadmin/form/form';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';
import { ArticuloService } from '../../../../service/articulo';

@Component({
  selector: 'app-articulo-teamadmin-edit-page',
  imports: [ArticuloTeamadminForm, BreadcrumbComponent],
  template: '<app-breadcrumb [items]=\"breadcrumbItems()\"></app-breadcrumb><app-articulo-teamadmin-form [id]="id_articulo()" [returnUrl]="returnUrl"></app-articulo-teamadmin-form>',
})
export class ArticuloTeamadminEditPage implements OnInit {
  breadcrumbItems = signal<BreadcrumbItem[]>([
    { label: 'Mis Clubes', route: '/club/teamadmin' },
    { label: 'Tipos de Artículo', route: '/tipoarticulo/teamadmin' },
    { label: 'Artículos', route: '/articulo/teamadmin' },
    { label: 'Editar Artículo' },
  ]);

  private route = inject(ActivatedRoute);
  private articuloService = inject(ArticuloService);
  id_articulo = signal<number>(0);
  returnUrl = '/articulo/teamadmin';

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
          items.push({ label: art.descripcion, route: `/articulo/teamadmin/view/${art.id}` });
          items.push({ label: 'Editar Artículo' });
          this.breadcrumbItems.set(items);
        },
        error: () => {},
      });
    }
  }
}
