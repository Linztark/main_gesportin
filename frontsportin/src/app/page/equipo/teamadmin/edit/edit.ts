import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EquipoTeamadminForm } from '../../../../component/equipo/teamadmin/form/form';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';
import { EquipoService } from '../../../../service/equipo';

@Component({
  selector: 'app-equipo-teamadmin-edit-page',
  imports: [EquipoTeamadminForm, BreadcrumbComponent],
  template: '<app-breadcrumb [items]=\"breadcrumbItems()\"></app-breadcrumb><app-equipo-teamadmin-form [id]="id_equipo()" [returnUrl]="returnUrl"></app-equipo-teamadmin-form>',
})
export class EquipoTeamadminEditPage implements OnInit {
  breadcrumbItems = signal<BreadcrumbItem[]>([
    { label: 'Mis Clubes', route: '/club/teamadmin' },
    { label: 'Temporadas', route: '/temporada/teamadmin' },
    { label: 'Categorías', route: '/categoria/teamadmin' },
    { label: 'Equipos', route: '/equipo/teamadmin' },
    { label: 'Editar Equipo' },
  ]);

  private route = inject(ActivatedRoute);
  private equipoService = inject(EquipoService);
  id_equipo = signal<number>(0);
  returnUrl = '/equipo/teamadmin';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const n = id ? Number(id) : NaN;
    this.id_equipo.set(n);
    if (!isNaN(n)) {
      this.equipoService.get(n).subscribe({
        next: (equipo) => {
          const cat = equipo.categoria;
          const temp = cat?.temporada;
          const items: BreadcrumbItem[] = [{ label: 'Mis Clubes', route: '/club/teamadmin' }];
          if (temp?.club) {
            items.push({ label: temp.club.nombre, route: `/club/teamadmin/view/${temp.club.id}` });
          }
          items.push({ label: 'Temporadas', route: '/temporada/teamadmin' });
          if (temp) {
            items.push({ label: temp.descripcion, route: `/temporada/teamadmin/view/${temp.id}` });
          }
          if (cat) {
            items.push({ label: 'Categorías', route: temp ? `/categoria/teamadmin/temporada/${temp.id}` : '/categoria/teamadmin' });
            items.push({ label: cat.nombre!, route: `/categoria/teamadmin/view/${cat.id}` });
          } else {
            items.push({ label: 'Categorías', route: '/categoria/teamadmin' });
          }
          items.push({ label: 'Equipos', route: cat ? `/equipo/teamadmin/categoria/${cat.id}` : '/equipo/teamadmin' });
          items.push({ label: equipo.nombre!, route: `/equipo/teamadmin/view/${equipo.id}` });
          items.push({ label: 'Editar Equipo' });
          this.breadcrumbItems.set(items);
        },
        error: () => {},
      });
    }
  }
}
