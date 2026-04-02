import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CuotaTeamadminDetail } from '../../../../component/cuota/teamadmin/detail/detail';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';
import { CuotaService } from '../../../../service/cuota';

@Component({
  selector: 'app-cuota-teamadmin-view-page',
  imports: [CuotaTeamadminDetail, BreadcrumbComponent],
  template: '<app-breadcrumb [items]=\"breadcrumbItems()\"></app-breadcrumb><app-cuota-teamadmin-detail [id]="id_cuota"></app-cuota-teamadmin-detail>',
})
export class CuotaTeamadminViewPage implements OnInit {
  breadcrumbItems = signal<BreadcrumbItem[]>([
    { label: 'Mis Clubes', route: '/club/teamadmin' },
    { label: 'Temporadas', route: '/temporada/teamadmin' },
    { label: 'Categorías', route: '/categoria/teamadmin' },
    { label: 'Equipos', route: '/equipo/teamadmin' },
    { label: 'Cuotas', route: '/cuota/teamadmin' },
    { label: 'Cuota' },
  ]);

  private route = inject(ActivatedRoute);
  private cuotaService = inject(CuotaService);
  id_cuota = signal<number>(0);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const n = id ? Number(id) : NaN;
    this.id_cuota.set(n);
    if (!isNaN(n)) {
      this.cuotaService.get(n).subscribe({
        next: (cuota) => {
          const equipo = cuota.equipo;
          const cat = equipo?.categoria;
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
          if (equipo) {
            items.push({ label: 'Equipos', route: cat ? `/equipo/teamadmin/categoria/${cat.id}` : '/equipo/teamadmin' });
            items.push({ label: equipo.nombre!, route: `/equipo/teamadmin/view/${equipo.id}` });
          } else {
            items.push({ label: 'Equipos', route: '/equipo/teamadmin' });
          }
          items.push({ label: 'Cuotas', route: equipo ? `/cuota/teamadmin/equipo/${equipo.id}` : '/cuota/teamadmin' });
          items.push({ label: cuota.descripcion });
          this.breadcrumbItems.set(items);
        },
        error: () => {},
      });
    }
  }
}
