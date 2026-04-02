import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PagoTeamadminForm } from '../../../../component/pago/teamadmin/form/form';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';
import { CuotaService } from '../../../../service/cuota';

@Component({
  selector: 'app-pago-teamadmin-new-page',
  imports: [PagoTeamadminForm, BreadcrumbComponent],
  template: '<app-breadcrumb [items]=\"breadcrumbItems()\"></app-breadcrumb><app-pago-teamadmin-form [returnUrl]="returnUrl" [idCuota]="idCuota()"></app-pago-teamadmin-form>',
})
export class PagoTeamadminNewPage implements OnInit {
  breadcrumbItems = signal<BreadcrumbItem[]>([
    { label: 'Mis Clubes', route: '/club/teamadmin' },
    { label: 'Cuotas', route: '/cuota/teamadmin' },
    { label: 'Pagos', route: '/pago/teamadmin' },
    { label: 'Nuevo Pago' },
  ]);

  private route = inject(ActivatedRoute);
  private cuotaService = inject(CuotaService);
  returnUrl = '/pago/teamadmin';
  idCuota = signal<number>(0);

  ngOnInit(): void {
    const val = this.route.snapshot.queryParamMap.get('id_cuota');
    if (val) {
      const n = Number(val);
      this.idCuota.set(n);
      this.cuotaService.get(n).subscribe({
        next: (cuota) => {
          const equipo = cuota.equipo;
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
          items.push({ label: 'Cuotas', route: equipo ? `/cuota/teamadmin/equipo/${equipo.id}` : '/cuota/teamadmin' });
          items.push({ label: cuota.descripcion, route: `/cuota/teamadmin/view/${cuota.id}` });
          items.push({ label: 'Pagos', route: `/pago/teamadmin/cuota/${cuota.id}` });
          items.push({ label: 'Nuevo Pago' });
          this.breadcrumbItems.set(items);
        },
        error: () => {},
      });
    }
  }
}
