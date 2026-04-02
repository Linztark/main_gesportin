import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TemporadaTeamadminDetail } from '../../../../component/temporada/teamadmin/detail/detail';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';
import { TemporadaService } from '../../../../service/temporada';

@Component({
  selector: 'app-temporada-teamadmin-view-page',
  imports: [TemporadaTeamadminDetail, BreadcrumbComponent],
  template: '<app-breadcrumb [items]=\"breadcrumbItems()\"></app-breadcrumb><app-temporada-teamadmin-detail [id]="id_temporada"></app-temporada-teamadmin-detail>',
})
export class TemporadaTeamadminViewPage implements OnInit {
  breadcrumbItems = signal<BreadcrumbItem[]>([
    { label: 'Mis Clubes', route: '/club/teamadmin' },
    { label: 'Temporadas', route: '/temporada/teamadmin' },
    { label: 'Temporada' },
  ]);

  private route = inject(ActivatedRoute);
  private temporadaService = inject(TemporadaService);
  id_temporada = signal<number>(0);

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
          items.push({ label: temp.descripcion });
          this.breadcrumbItems.set(items);
        },
        error: () => {},
      });
    }
  }
}
