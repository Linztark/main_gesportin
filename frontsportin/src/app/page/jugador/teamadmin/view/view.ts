import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JugadorTeamadminDetail } from '../../../../component/jugador/teamadmin/detail/detail';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';
import { JugadorService } from '../../../../service/jugador-service';

@Component({
  selector: 'app-jugador-teamadmin-view-page',
  imports: [JugadorTeamadminDetail, BreadcrumbComponent],
  template: '<app-breadcrumb [items]=\"breadcrumbItems()\"></app-breadcrumb><app-jugador-teamadmin-detail [id]="id_jugador"></app-jugador-teamadmin-detail>',
})
export class JugadorTeamadminViewPage implements OnInit {
  breadcrumbItems = signal<BreadcrumbItem[]>([
    { label: 'Mis Clubes', route: '/club/teamadmin' },
    { label: 'Temporadas', route: '/temporada/teamadmin' },
    { label: 'Categorías', route: '/categoria/teamadmin' },
    { label: 'Equipos', route: '/equipo/teamadmin' },
    { label: 'Jugadores' },
  ]);

  private route = inject(ActivatedRoute);
  private jugadorService = inject(JugadorService);
  id_jugador = signal<number>(0);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const n = id ? Number(id) : NaN;
    this.id_jugador.set(n);
    if (!isNaN(n)) {
      this.jugadorService.getById(n).subscribe({
        next: (jugador) => {
          const equipo = jugador.equipo;
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
          items.push({ label: 'Jugadores', route: equipo ? `/jugador/teamadmin/equipo/${equipo.id}` : '/jugador/teamadmin' });
          items.push({ label: `${jugador.usuario.nombre} ${jugador.usuario.apellido1}` });
          this.breadcrumbItems.set(items);
        },
        error: () => {},
      });
    }
  }
}
