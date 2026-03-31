import { Component, inject, Input, OnInit, Signal, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ITemporada } from '../../../../model/temporada';
import { DatetimePipe } from '../../../../pipe/datetime-pipe';
import { TemporadaService } from '../../../../service/temporada';
import { SessionService } from '../../../../service/session';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../shared/breadcrumb/breadcrumb';

@Component({
  selector: 'app-temporada-teamadmin-detail',
  imports: [CommonModule, RouterLink, DatetimePipe, BreadcrumbComponent],
  templateUrl: './detail.html',
  styleUrl: './detail.css',
})
export class TemporadaTeamadminDetail implements OnInit {
  @Input() id: Signal<number> = signal(0);

  private oTemporadaService = inject(TemporadaService);
  session = inject(SessionService);

  oTemporada = signal<ITemporada | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  breadcrumbItems = signal<BreadcrumbItem[]>([
    { label: 'Mis Clubes', route: '/club/teamadmin' },
    { label: 'Temporadas', route: '/temporada/teamadmin' },
    { label: 'Temporada' },
  ]);

  ngOnInit(): void {
    this.load(this.id());
  }

  load(id: number): void {
    this.oTemporadaService.get(id).subscribe({
      next: (data: ITemporada) => {
        this.oTemporada.set(data);
        this.loading.set(false);
        const club = data.club;
        this.breadcrumbItems.set([
          { label: 'Mis Clubes', route: '/club/teamadmin' },
          ...(club ? [{ label: club.nombre, route: `/club/teamadmin/view/${club.id}` }] : []),
          { label: 'Temporadas', route: club ? `/temporada/teamadmin/club/${club.id}` : '/temporada/teamadmin' },
          { label: data.descripcion },
        ]);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando la temporada');
        this.loading.set(false);
        console.error(err);
      },
    });
  }
}
