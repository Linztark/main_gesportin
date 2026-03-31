import { Component, signal, OnInit, inject, Input, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { DatetimePipe } from '../../../../pipe/datetime-pipe';
import { PagoService } from '../../../../service/pago';
import { IPago } from '../../../../model/pago';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../shared/breadcrumb/breadcrumb';

@Component({
  standalone: true,
  selector: 'app-pago-teamadmin-detail',
  imports: [CommonModule, RouterLink, DatetimePipe, BreadcrumbComponent],
  templateUrl: './detail.html',
  styleUrl: './detail.css',
})
export class PagoTeamadminDetail implements OnInit {
  @Input() id: Signal<number> = signal(0);

  private pagoService = inject(PagoService);

  oPago = signal<IPago | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  breadcrumbItems = signal<BreadcrumbItem[]>([
    { label: 'Mis Clubes', route: '/club/teamadmin' },
    { label: 'Temporadas', route: '/temporada/teamadmin' },
    { label: 'Categorías', route: '/categoria/teamadmin' },
    { label: 'Equipos', route: '/equipo/teamadmin' },
    { label: 'Cuotas', route: '/cuota/teamadmin' },
    { label: 'Pagos', route: '/pago/teamadmin' },
    { label: 'Pago' },
  ]);

  ngOnInit(): void {
    const idPago = this.id();
    if (!idPago || isNaN(idPago)) {
      this.error.set('ID de pago no válido');
      this.loading.set(false);
      return;
    }
    this.load(idPago);
  }

  private load(id: number): void {
    this.pagoService.get(id).subscribe({
      next: (data) => {
        this.oPago.set(data);
        this.loading.set(false);
        const cuota = data.cuota;
        const equipo = cuota?.equipo;
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
          ...(cuota ? [{ label: cuota.descripcion, route: `/cuota/teamadmin/view/${cuota.id}` }] : []),
          { label: 'Pagos', route: cuota ? `/pago/teamadmin/cuota/${cuota.id}` : '/pago/teamadmin' },
          { label: `#${data.id}` },
        ]);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando el pago');
        console.error(err);
        this.loading.set(false);
      },
    });
  }
}
