import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PartidoTeamadminDetail } from '../../../../component/partido/teamadmin/detail/detail';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';
import { PartidoService } from '../../../../service/partido';

@Component({
  selector: 'app-partido-teamadmin-view-page',
  imports: [PartidoTeamadminDetail, BreadcrumbComponent],
  template: '<app-breadcrumb [items]=\"breadcrumbItems()\"></app-breadcrumb><app-partido-teamadmin-detail [id]="id_partido"></app-partido-teamadmin-detail>',
})
export class PartidoTeamadminViewPage implements OnInit {
  breadcrumbItems = signal<BreadcrumbItem[]>([
    { label: 'Mis Clubes', route: '/club/teamadmin' },
    { label: 'Temporadas', route: '/temporada/teamadmin' },
    { label: 'Categorías', route: '/categoria/teamadmin' },
    { label: 'Equipos', route: '/equipo/teamadmin' },
    { label: 'Ligas', route: '/liga/teamadmin' },
    { label: 'Partidos', route: '/partido/teamadmin' },
    { label: 'Partido' },
  ]);

  private route = inject(ActivatedRoute);
  private partidoService = inject(PartidoService);
  id_partido = signal<number>(0);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const n = id ? Number(id) : NaN;
    this.id_partido.set(n);
    if (!isNaN(n)) {
      this.partidoService.get(n).subscribe({
        next: (partido) => {
          const liga = partido.liga;
          const equipo = liga?.equipo;
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
          if (liga) {
            items.push({ label: 'Ligas', route: equipo ? `/liga/teamadmin/equipo/${equipo.id}` : '/liga/teamadmin' });
            items.push({ label: liga.nombre, route: `/liga/teamadmin/view/${liga.id}` });
          } else {
            items.push({ label: 'Ligas', route: '/liga/teamadmin' });
          }
          items.push({ label: 'Partidos', route: liga ? `/partido/teamadmin/liga/${liga.id}` : '/partido/teamadmin' });
          items.push({ label: partido.rival });
          this.breadcrumbItems.set(items);
        },
        error: () => {},
      });
    }
  }
}
