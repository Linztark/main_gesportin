import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoriaTeamadminDetail } from '../../../../component/categoria/teamadmin/detail/detail';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';
import { CategoriaService } from '../../../../service/categoria';

@Component({
  selector: 'app-categoria-teamadmin-view-page',
  imports: [CategoriaTeamadminDetail, BreadcrumbComponent],
  template: '<app-breadcrumb [items]=\"breadcrumbItems()\"></app-breadcrumb><app-categoria-teamadmin-detail [id]="id_categoria"></app-categoria-teamadmin-detail>',
})
export class CategoriaTeamadminViewPage implements OnInit {
  breadcrumbItems = signal<BreadcrumbItem[]>([
    { label: 'Mis Clubes', route: '/club/teamadmin' },
    { label: 'Temporadas', route: '/temporada/teamadmin' },
    { label: 'Categorías', route: '/categoria/teamadmin' },
    { label: 'Categoría' },
  ]);

  private route = inject(ActivatedRoute);
  private categoriaService = inject(CategoriaService);
  id_categoria = signal<number>(0);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const n = id ? Number(id) : NaN;
    this.id_categoria.set(n);
    if (!isNaN(n)) {
      this.categoriaService.get(n).subscribe({
        next: (cat) => {
          const temp = cat.temporada;
          const items: BreadcrumbItem[] = [{ label: 'Mis Clubes', route: '/club/teamadmin' }];
          if (temp?.club) {
            items.push({ label: temp.club.nombre, route: `/club/teamadmin/view/${temp.club.id}` });
          }
          items.push({ label: 'Temporadas', route: '/temporada/teamadmin' });
          if (temp) {
            items.push({ label: temp.descripcion, route: `/temporada/teamadmin/view/${temp.id}` });
          }
          items.push({ label: 'Categorías', route: temp ? `/categoria/teamadmin/temporada/${temp.id}` : '/categoria/teamadmin' });
          items.push({ label: cat.nombre });
          this.breadcrumbItems.set(items);
        },
        error: () => {},
      });
    }
  }
}
