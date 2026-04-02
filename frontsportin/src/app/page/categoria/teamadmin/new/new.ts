import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoriaTeamadminForm } from '../../../../component/categoria/teamadmin/form/form';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';
import { TemporadaService } from '../../../../service/temporada';

@Component({
  selector: 'app-categoria-teamadmin-new-page',
  imports: [CategoriaTeamadminForm, BreadcrumbComponent],
  template: '<app-breadcrumb [items]=\"breadcrumbItems()\"></app-breadcrumb><app-categoria-teamadmin-form [returnUrl]="returnUrl" [idTemporada]="idTemporada()"></app-categoria-teamadmin-form>',
})
export class CategoriaTeamadminNewPage implements OnInit {
  breadcrumbItems = signal<BreadcrumbItem[]>([
    { label: 'Mis Clubes', route: '/club/teamadmin' },
    { label: 'Temporadas', route: '/temporada/teamadmin' },
    { label: 'Categorías', route: '/categoria/teamadmin' },
    { label: 'Nueva Categoría' },
  ]);

  private route = inject(ActivatedRoute);
  private temporadaService = inject(TemporadaService);
  returnUrl = '/categoria/teamadmin';
  idTemporada = signal<number>(0);

  ngOnInit(): void {
    const val = this.route.snapshot.queryParamMap.get('id_temporada');
    if (val) {
      const n = Number(val);
      this.idTemporada.set(n);
      this.temporadaService.get(n).subscribe({
        next: (temp) => {
          const items: BreadcrumbItem[] = [{ label: 'Mis Clubes', route: '/club/teamadmin' }];
          if (temp.club) {
            items.push({ label: temp.club.nombre, route: `/club/teamadmin/view/${temp.club.id}` });
          }
          items.push({ label: 'Temporadas', route: '/temporada/teamadmin' });
          items.push({ label: temp.descripcion, route: `/temporada/teamadmin/view/${temp.id}` });
          items.push({ label: 'Categorías', route: `/categoria/teamadmin/temporada/${temp.id}` });
          items.push({ label: 'Nueva Categoría' });
          this.breadcrumbItems.set(items);
        },
        error: () => {},
      });
    }
  }
}
