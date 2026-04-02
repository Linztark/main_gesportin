import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EquipoTeamadminDetail } from '../../../../component/equipo/teamadmin/detail/detail';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';
import { EquipoService } from '../../../../service/equipo';

@Component({
  selector: 'app-equipo-teamadmin-view-page',
  imports: [EquipoTeamadminDetail, BreadcrumbComponent],
  template: '<app-breadcrumb [items]=\"breadcrumbItems()\"></app-breadcrumb><app-equipo-teamadmin-detail [id]="id_equipo"></app-equipo-teamadmin-detail>',
})
export class EquipoTeamadminViewPage implements OnInit {
  breadcrumbItems = signal<BreadcrumbItem[]>([
    { label: 'Mis Clubes', route: '/club/teamadmin' },
    { label: 'Temporadas', route: '/temporada/teamadmin' },
    { label: 'Categorías', route: '/categoria/teamadmin' },
    { label: 'Equipos', route: '/equipo/teamadmin' },
    { label: 'Equipo' },
  ]);

  private route = inject(ActivatedRoute);
  private equipoService = inject(EquipoService);
  id_equipo = signal<number>(0);

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
          items.push({ label: equipo.nombre! });
          this.breadcrumbItems.set(items);
        },
        error: () => {},
      });
    }
  }
}
