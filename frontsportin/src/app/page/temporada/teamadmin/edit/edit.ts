import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TemporadaTeamadminForm } from '../../../../component/temporada/teamadmin/form/form';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';
import { TemporadaService } from '../../../../service/temporada';

@Component({
  selector: 'app-temporada-teamadmin-edit-page',
  imports: [TemporadaTeamadminForm, BreadcrumbComponent],
  template: '<app-breadcrumb [items]=\"breadcrumbItems()\"></app-breadcrumb><app-temporada-teamadmin-form [id]="id_temporada()" [returnUrl]="returnUrl"></app-temporada-teamadmin-form>',
})
export class TemporadaTeamadminEditPage implements OnInit {
  breadcrumbItems = signal<BreadcrumbItem[]>([
    { label: 'Mis Clubes', route: '/club/teamadmin' },
    { label: 'Temporadas', route: '/temporada/teamadmin' },
    { label: 'Editar Temporada' },
  ]);

  private route = inject(ActivatedRoute);
  private temporadaService = inject(TemporadaService);
  id_temporada = signal<number>(0);
  returnUrl = '/temporada/teamadmin';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const n = id ? Number(id) : NaN;
    this.id_temporada.set(n);
    if (!isNaN(n)) {
      this.temporadaService.get(n).subscribe({
        next: (temp) => {
          const items: BreadcrumbItem[] = [{ label: 'Mis Clubes', route: '/club/teamadmin' }];
          if (temp.club) {
            items.push({ label: temp.club.nombre, route: `/club/teamadmin/view/${temp.club.id}` });
          }
          items.push({ label: 'Temporadas', route: '/temporada/teamadmin' });
          items.push({ label: temp.descripcion, route: `/temporada/teamadmin/view/${temp.id}` });
          items.push({ label: 'Editar Temporada' });
          this.breadcrumbItems.set(items);
        },
        error: () => {},
      });
    }
  }
}
