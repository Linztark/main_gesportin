import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoriaTeamadminForm } from '../../../../component/categoria/teamadmin/form/form';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';
import { CategoriaService } from '../../../../service/categoria';

@Component({
  selector: 'app-categoria-teamadmin-edit-page',
  imports: [CategoriaTeamadminForm, BreadcrumbComponent],
  template: '<app-breadcrumb [items]=\"breadcrumbItems()\"></app-breadcrumb><app-categoria-teamadmin-form [id]="id_categoria()" [returnUrl]="returnUrl"></app-categoria-teamadmin-form>',
})
export class CategoriaTeamadminEditPage implements OnInit {
  breadcrumbItems = signal<BreadcrumbItem[]>([
    { label: 'Mis Clubes', route: '/club/teamadmin' },
    { label: 'Temporadas', route: '/temporada/teamadmin' },
    { label: 'Categorías', route: '/categoria/teamadmin' },
    { label: 'Editar Categoría' },
  ]);

  private route = inject(ActivatedRoute);
  private categoriaService = inject(CategoriaService);
  id_categoria = signal<number>(0);
  returnUrl = '/categoria/teamadmin';

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
          items.push({ label: cat.nombre, route: `/categoria/teamadmin/view/${cat.id}` });
          items.push({ label: 'Editar Categoría' });
          this.breadcrumbItems.set(items);
        },
        error: () => {},
      });
    }
  }
}
