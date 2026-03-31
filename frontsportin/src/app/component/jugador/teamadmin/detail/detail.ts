import { Component, signal, OnInit, inject, Input, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { JugadorService } from '../../../../service/jugador-service';
import { IJugador } from '../../../../model/jugador';
import { SessionService } from '../../../../service/session';
import { DatetimePipe } from '../../../../pipe/datetime-pipe';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../shared/breadcrumb/breadcrumb';

@Component({
  standalone: true,
  selector: 'app-jugador-teamadmin-detail',
  imports: [CommonModule, RouterLink, DatetimePipe, BreadcrumbComponent],
  templateUrl: './detail.html',
  styleUrl: './detail.css',
})
export class JugadorTeamadminDetail implements OnInit {
  @Input() id: Signal<number> = signal(0);

  private jugadorService = inject(JugadorService);
  session = inject(SessionService);

  oJugador = signal<IJugador | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  breadcrumbItems = signal<BreadcrumbItem[]>([
    { label: 'Mis Clubes', route: '/club/teamadmin' },
    { label: 'Temporadas', route: '/temporada/teamadmin' },
    { label: 'Categorías', route: '/categoria/teamadmin' },
    { label: 'Equipos', route: '/equipo/teamadmin' },
    { label: 'Jugadores', route: '/jugador/teamadmin' },
    { label: 'Jugador' },
  ]);

  ngOnInit(): void {
    const idJugador = this.id();
    if (!idJugador || isNaN(idJugador)) {
      this.error.set('ID de jugador no válido');
      this.loading.set(false);
      return;
    }
    this.load(idJugador);
  }

  private load(id: number): void {
    this.jugadorService.getById(id).subscribe({
      next: (data: IJugador) => {
        this.oJugador.set(data);
        this.loading.set(false);
        const equipo = data.equipo;
        const cat = equipo?.categoria;
        const temp = cat?.temporada;
        this.breadcrumbItems.set([
          { label: 'Mis Clubes', route: '/club/teamadmin' },
          { label: 'Temporadas', route: '/temporada/teamadmin' },
          ...(temp ? [{ label: temp.descripcion, route: `/temporada/teamadmin/view/${temp.id}` }] : []),
          { label: 'Categorías', route: temp ? `/categoria/teamadmin/temporada/${temp.id}` : '/categoria/teamadmin' },
          ...(cat ? [{ label: cat.nombre, route: `/categoria/teamadmin/view/${cat.id}` }] : []),
          { label: 'Equipos', route: cat ? `/equipo/teamadmin/categoria/${cat.id}` : '/equipo/teamadmin' },
          ...(equipo ? [{ label: equipo.nombre ?? '', route: `/equipo/teamadmin/view/${equipo.id}` }] : []),
          { label: 'Jugadores', route: equipo ? `/jugador/teamadmin/equipo/${equipo.id}` : '/jugador/teamadmin' },
          { label: data.usuario ? `${data.usuario.nombre} ${data.usuario.apellido1}` : `#${data.id}` },
        ]);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando el jugador');
        console.error(err);
        this.loading.set(false);
      },
    });
  }
}
