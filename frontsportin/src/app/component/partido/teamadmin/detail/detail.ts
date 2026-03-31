import { Component, signal, OnInit, inject, Input, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { DatetimePipe } from '../../../../pipe/datetime-pipe';
import { PartidoService } from '../../../../service/partido';
import { IPartido } from '../../../../model/partido';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../shared/breadcrumb/breadcrumb';

@Component({
  standalone: true,
  selector: 'app-partido-teamadmin-detail',
  imports: [CommonModule, RouterLink, DatetimePipe, BreadcrumbComponent],
  templateUrl: './detail.html',
  styleUrl: './detail.css',
})
export class PartidoTeamadminDetail implements OnInit {
  @Input() id: Signal<number> = signal(0);

  private partidoService = inject(PartidoService);

  oPartido = signal<IPartido | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  breadcrumbItems = signal<BreadcrumbItem[]>([
    { label: 'Mis Clubes', route: '/club/teamadmin' },
    { label: 'Temporadas', route: '/temporada/teamadmin' },
    { label: 'Categorías', route: '/categoria/teamadmin' },
    { label: 'Equipos', route: '/equipo/teamadmin' },
    { label: 'Ligas', route: '/liga/teamadmin' },
    { label: 'Partidos', route: '/partido/teamadmin' },
    { label: 'Partido' },
  ]);

  ngOnInit(): void {
    const idPartido = this.id();
    if (!idPartido || isNaN(idPartido)) {
      this.error.set('ID de partido no válido');
      this.loading.set(false);
      return;
    }
    this.load(idPartido);
  }

  private load(id: number): void {
    this.partidoService.get(id).subscribe({
      next: (data) => {
        this.oPartido.set(data);
        this.loading.set(false);
        const liga = data.liga;
        const equipo = liga?.equipo;
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
          { label: 'Ligas', route: equipo ? `/liga/teamadmin/equipo/${equipo.id}` : '/liga/teamadmin' },
          ...(liga ? [{ label: liga.nombre, route: `/liga/teamadmin/view/${liga.id}` }] : []),
          { label: 'Partidos', route: liga ? `/partido/teamadmin/liga/${liga.id}` : '/partido/teamadmin' },
          { label: data.rival ?? '' },
        ]);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando el partido');
        console.error(err);
        this.loading.set(false);
      },
    });
  }
}
