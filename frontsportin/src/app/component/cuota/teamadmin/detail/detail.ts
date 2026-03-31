import { Component, signal, OnInit, inject, Input, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { CuotaService } from '../../../../service/cuota';
import { ICuota } from '../../../../model/cuota';
import { DatetimePipe } from '../../../../pipe/datetime-pipe';
import { SessionService } from '../../../../service/session';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../shared/breadcrumb/breadcrumb';

@Component({
  standalone: true,
  selector: 'app-cuota-teamadmin-detail',
  imports: [CommonModule, RouterLink, DatetimePipe, BreadcrumbComponent],
  templateUrl: './detail.html',
  styleUrl: './detail.css',
})
export class CuotaTeamadminDetail implements OnInit {
  @Input() id: Signal<number> = signal(0);

  private cuotaService = inject(CuotaService);
  session = inject(SessionService);

  oCuota = signal<ICuota | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  breadcrumbItems = signal<BreadcrumbItem[]>([
    { label: 'Mis Clubes', route: '/club/teamadmin' },
    { label: 'Temporadas', route: '/temporada/teamadmin' },
    { label: 'Categorías', route: '/categoria/teamadmin' },
    { label: 'Equipos', route: '/equipo/teamadmin' },
    { label: 'Cuotas', route: '/cuota/teamadmin' },
    { label: 'Cuota' },
  ]);

  ngOnInit(): void {
    const idCuota = this.id();
    if (!idCuota || isNaN(idCuota)) {
      this.error.set('ID de cuota no válido');
      this.loading.set(false);
      return;
    }
    this.load(idCuota);
  }

  private load(id: number): void {
    this.cuotaService.get(id).subscribe({
      next: (data) => {
        this.oCuota.set(data);
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
          { label: 'Cuotas', route: equipo ? `/cuota/teamadmin/equipo/${equipo.id}` : '/cuota/teamadmin' },
          { label: data.descripcion ?? '' },
        ]);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando la cuota');
        console.error(err);
        this.loading.set(false);
      },
    });
  }
}
