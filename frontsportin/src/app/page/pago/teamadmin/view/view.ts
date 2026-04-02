import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PagoTeamadminDetail } from '../../../../component/pago/teamadmin/detail/detail';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';
import { PagoService } from '../../../../service/pago';

@Component({
  selector: 'app-pago-teamadmin-view-page',
  imports: [PagoTeamadminDetail, BreadcrumbComponent],
  template: '<app-breadcrumb [items]=\"breadcrumbItems()\"></app-breadcrumb><app-pago-teamadmin-detail [id]="id_pago"></app-pago-teamadmin-detail>',
})
export class PagoTeamadminViewPage implements OnInit {
  breadcrumbItems = signal<BreadcrumbItem[]>([
    { label: 'Mis Clubes', route: '/club/teamadmin' },
    { label: 'Temporadas', route: '/temporada/teamadmin' },
    { label: 'Categorías', route: '/categoria/teamadmin' },
    { label: 'Equipos', route: '/equipo/teamadmin' },
    { label: 'Cuotas', route: '/cuota/teamadmin' },
    { label: 'Pagos', route: '/pago/teamadmin' },
    { label: 'Pago' },
  ]);

  private route = inject(ActivatedRoute);
  private pagoService = inject(PagoService);
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
          items.push({ label: 'Pago' });
          this.breadcrumbItems.set(items);
        },
        error: () => {},
      });
    }
  }
}
