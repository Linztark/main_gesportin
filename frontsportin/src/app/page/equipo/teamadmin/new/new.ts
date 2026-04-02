import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EquipoTeamadminForm } from '../../../../component/equipo/teamadmin/form/form';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';
import { CategoriaService } from '../../../../service/categoria';

@Component({
  selector: 'app-equipo-teamadmin-new-page',
  imports: [EquipoTeamadminForm, BreadcrumbComponent],
  template: '<app-breadcrumb [items]=\"breadcrumbItems()\"></app-breadcrumb><app-equipo-teamadmin-form [returnUrl]="returnUrl" [idCategoria]="idCategoria()"></app-equipo-teamadmin-form>',
})
export class EquipoTeamadminNewPage implements OnInit {
  breadcrumbItems = signal<BreadcrumbItem[]>([
    { label: 'Mis Clubes', route: '/club/teamadmin' },
    { label: 'Temporadas', route: '/temporada/teamadmin' },
    { label: 'Categorías', route: '/categoria/teamadmin' },
    { label: 'Equipos', route: '/equipo/teamadmin' },
    { label: 'Nuevo Equipo' },
  ]);

  private route = inject(ActivatedRoute);
  private categoriaService = inject(CategoriaService);
  returnUrl = '/equipo/teamadmin';
  idCategoria = signal<number>(0);

  ngOnInit(): void {
    const val = this.route.snapshot.queryParamMap.get('id_categoria');
    if (val) {
      const n = Number(val);
      this.idCategoria.set(n);
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
          items.push({ label: 'Equipos', route: `/equipo/teamadmin/categoria/${cat.id}` });
          items.push({ label: 'Nuevo Equipo' });
          this.breadcrumbItems.set(items);
        },
        error: () => {},
      });
    }
  }
}
