import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CuotaTeamadminForm } from '../../../../component/cuota/teamadmin/form/form';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';
import { EquipoService } from '../../../../service/equipo';

@Component({
  selector: 'app-cuota-teamadmin-new-page',
  imports: [CuotaTeamadminForm, BreadcrumbComponent],
  template: '<app-breadcrumb [items]=\"breadcrumbItems()\"></app-breadcrumb><app-cuota-teamadmin-form [returnUrl]="returnUrl" [idEquipo]="idEquipo()"></app-cuota-teamadmin-form>',
})
export class CuotaTeamadminNewPage implements OnInit {
  breadcrumbItems = signal<BreadcrumbItem[]>([
    { label: 'Mis Clubes', route: '/club/teamadmin' },
    { label: 'Temporadas', route: '/temporada/teamadmin' },
    { label: 'Categorías', route: '/categoria/teamadmin' },
    { label: 'Equipos', route: '/equipo/teamadmin' },
    { label: 'Cuotas', route: '/cuota/teamadmin' },
    { label: 'Nueva Cuota' },
  ]);

  private route = inject(ActivatedRoute);
  private equipoService = inject(EquipoService);
  returnUrl = '/cuota/teamadmin';
  idEquipo = signal<number>(0);

  ngOnInit(): void {
    const val = this.route.snapshot.queryParamMap.get('id_equipo');
    if (val) {
      const n = Number(val);
      this.idEquipo.set(n);
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
          items.push({ label: 'Cuotas', route: `/cuota/teamadmin/equipo/${equipo.id}` });
          items.push({ label: 'Nueva Cuota' });
          this.breadcrumbItems.set(items);
        },
        error: () => {},
      });
    }
  }
}
