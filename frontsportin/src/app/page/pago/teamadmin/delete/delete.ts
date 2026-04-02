import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { PagoService } from '../../../../service/pago';
import { NotificacionService } from '../../../../service/notificacion';;
import { PagoTeamadminDetail } from '../../../../component/pago/teamadmin/detail/detail';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';

@Component({
  selector: 'app-pago-teamadmin-delete-page',
  imports: [PagoTeamadminDetail, BreadcrumbComponent],
  templateUrl: './delete.html',
})
export class PagoTeamadminDeletePage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private pagoService = inject(PagoService);
  private notificacion = inject(NotificacionService);
  error = signal<string | null>(null);
  breadcrumbItems = signal<BreadcrumbItem[]>([
    { label: 'Mis Clubes', route: '/club/teamadmin' },
    { label: 'Cuotas', route: '/cuota/teamadmin' },
    { label: 'Pagos', route: '/pago/teamadmin' },
    { label: 'Eliminar Pago' },
  ]);
  id_pago = signal<number>(0);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const n = id ? Number(id) : NaN;
    this.id_pago.set(n);
    if (!isNaN(n)) {
      this.pagoService.get(n).subscribe({
        next: (pago) => {
          const cuota = pago.cuota;
          const equipo = cuota?.equipo;
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
          if (cuota) {
            items.push({ label: 'Cuotas', route: equipo ? `/cuota/teamadmin/equipo/${equipo.id}` : '/cuota/teamadmin' });
            items.push({ label: cuota.descripcion, route: `/cuota/teamadmin/view/${cuota.id}` });
          } else {
            items.push({ label: 'Cuotas', route: '/cuota/teamadmin' });
          }
          items.push({ label: 'Pagos', route: cuota ? `/pago/teamadmin/cuota/${cuota.id}` : '/pago/teamadmin' });
          items.push({ label: 'Eliminar Pago' });
          this.breadcrumbItems.set(items);
        },
        error: () => { this.error.set('Error cargando el registro'); },
      });
    } else {
      this.error.set('ID no válido');
    }
  }

  doDelete(): void {
    this.pagoService.delete(this.id_pago()).subscribe({
      next: () => {
        this.notificacion.info('Pago eliminado/a');
        this.router.navigate(['/pago/teamadmin']);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error eliminando el registro');
        this.notificacion.error('Error eliminando el registro');
        console.error(err);
      },
    });
  }

  doCancel(): void { window.history.back(); }
}
