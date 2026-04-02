import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TipoarticuloTeamadminDetail } from '../../../../component/tipoarticulo/teamadmin/detail/detail';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';
import { TipoarticuloService } from '../../../../service/tipoarticulo';

@Component({
  selector: 'app-tipoarticulo-teamadmin-view-page',
  imports: [TipoarticuloTeamadminDetail, BreadcrumbComponent],
  template: '<app-breadcrumb [items]=\"breadcrumbItems()\"></app-breadcrumb><app-tipoarticulo-teamadmin-detail [id]="id_tipoarticulo"></app-tipoarticulo-teamadmin-detail>',
})
export class TipoarticuloTeamadminViewPage implements OnInit {
  breadcrumbItems = signal<BreadcrumbItem[]>([
    { label: 'Mis Clubes', route: '/club/teamadmin' },
    { label: 'Tipos de Artículo', route: '/tipoarticulo/teamadmin' },
    { label: 'Tipo de Artículo' },
  ]);

  private route = inject(ActivatedRoute);
  private tipoarticuloService = inject(TipoarticuloService);
  id_tipoarticulo = signal<number>(0);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const n = id ? Number(id) : NaN;
    this.id_tipoarticulo.set(n);
    if (!isNaN(n)) {
      this.tipoarticuloService.get(n).subscribe({
        next: (tipo) => {
          const items: BreadcrumbItem[] = [{ label: 'Mis Clubes', route: '/club/teamadmin' }];
          if (tipo.club) {
            items.push({ label: tipo.club.nombre, route: `/club/teamadmin/view/${tipo.club.id}` });
          }
          items.push({ label: 'Tipos de Artículo', route: '/tipoarticulo/teamadmin' });
          items.push({ label: tipo.descripcion });
          this.breadcrumbItems.set(items);
        },
        error: () => {},
      });
    }
  }
}
