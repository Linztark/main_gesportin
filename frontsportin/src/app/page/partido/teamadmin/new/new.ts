import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PartidoTeamadminForm } from '../../../../component/partido/teamadmin/form/form';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';
import { LigaService } from '../../../../service/liga';

@Component({
  selector: 'app-partido-teamadmin-new-page',
  imports: [PartidoTeamadminForm, BreadcrumbComponent],
  template: '<app-breadcrumb [items]=\"breadcrumbItems()\"></app-breadcrumb><app-partido-teamadmin-form [returnUrl]="returnUrl" [idLiga]="idLiga()"></app-partido-teamadmin-form>',
})
export class PartidoTeamadminNewPage implements OnInit {
  breadcrumbItems = signal<BreadcrumbItem[]>([
    { label: 'Mis Clubes', route: '/club/teamadmin' },
    { label: 'Ligas', route: '/liga/teamadmin' },
    { label: 'Partidos', route: '/partido/teamadmin' },
    { label: 'Nuevo Partido' },
  ]);

  private route = inject(ActivatedRoute);
  private ligaService = inject(LigaService);
  returnUrl = '/partido/teamadmin';
  idLiga = signal<number>(0);

  ngOnInit(): void {
    const val = this.route.snapshot.queryParamMap.get('id_liga');
    if (val) {
      const n = Number(val);
      this.idLiga.set(n);
      this.ligaService.get(n).subscribe({
        next: (liga) => {
          const equipo = liga.equipo;
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
          items.push({ label: 'Ligas', route: equipo ? `/liga/teamadmin/equipo/${equipo.id}` : '/liga/teamadmin' });
          items.push({ label: liga.nombre, route: `/liga/teamadmin/view/${liga.id}` });
          items.push({ label: 'Partidos', route: `/partido/teamadmin/liga/${liga.id}` });
          items.push({ label: 'Nuevo Partido' });
          this.breadcrumbItems.set(items);
        },
        error: () => {},
      });
    }
  }
}
