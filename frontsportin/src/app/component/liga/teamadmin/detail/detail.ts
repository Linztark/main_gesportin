import { Component, signal, OnInit, inject, Input, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { LigaService } from '../../../../service/liga';
import { ILiga } from '../../../../model/liga';
import { DatetimePipe } from '../../../../pipe/datetime-pipe';
import { SessionService } from '../../../../service/session';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../shared/breadcrumb/breadcrumb';

@Component({
  standalone: true,
  selector: 'app-liga-teamadmin-detail',
  imports: [CommonModule, RouterLink, DatetimePipe, BreadcrumbComponent],
  templateUrl: './detail.html',
  styleUrl: './detail.css',
})
export class LigaTeamadminDetail implements OnInit {
  @Input() id: Signal<number> = signal(0);

  private oLigaService = inject(LigaService);
  session = inject(SessionService);

  oLiga = signal<ILiga | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  breadcrumbItems = signal<BreadcrumbItem[]>([
    { label: 'Mis Clubes', route: '/club/teamadmin' },
    { label: 'Temporadas', route: '/temporada/teamadmin' },
    { label: 'Categorías', route: '/categoria/teamadmin' },
    { label: 'Equipos', route: '/equipo/teamadmin' },
    { label: 'Ligas', route: '/liga/teamadmin' },
    { label: 'Liga' },
  ]);

  ngOnInit(): void {
    this.load(this.id());
  }

  load(id: number) {
    this.oLigaService.get(id).subscribe({
      next: (data: ILiga) => {
        this.oLiga.set(data);
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
          { label: 'Ligas', route: equipo ? `/liga/teamadmin/equipo/${equipo.id}` : '/liga/teamadmin' },
          { label: data.nombre ?? '' },
        ]);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando la liga');
        this.loading.set(false);
        console.error(err);
      },
    });
  }
}
