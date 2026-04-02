import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PuntuacionTeamadminDetail } from '../../../../component/puntuacion/teamadmin/detail/detail';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';
import { PuntuacionService } from '../../../../service/puntuacion';

@Component({
  selector: 'app-puntuacion-teamadmin-view-page',
  imports: [PuntuacionTeamadminDetail, BreadcrumbComponent],
  template: '<app-breadcrumb [items]=\"breadcrumbItems()\"></app-breadcrumb><app-puntuacion-teamadmin-detail [id]="id_puntuacion"></app-puntuacion-teamadmin-detail>',
})
export class PuntuacionTeamadminViewPage implements OnInit {
  breadcrumbItems = signal<BreadcrumbItem[]>([
    { label: 'Mis Clubes', route: '/club/teamadmin' },
    { label: 'Noticias', route: '/noticia/teamadmin' },
    { label: 'Puntuaciones', route: '/puntuacion/teamadmin' },
    { label: 'Puntuación' },
  ]);

  private route = inject(ActivatedRoute);
  private puntuacionService = inject(PuntuacionService);
  id_puntuacion = signal<number>(0);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const n = id ? Number(id) : NaN;
    this.id_puntuacion.set(n);
    if (!isNaN(n)) {
      this.puntuacionService.get(n).subscribe({
        next: (punt) => {
          const noticia = punt.noticia;
          const items: BreadcrumbItem[] = [{ label: 'Mis Clubes', route: '/club/teamadmin' }];
          if (noticia?.club) {
            items.push({ label: noticia.club.nombre, route: `/club/teamadmin/view/${noticia.club.id}` });
          }
          items.push({ label: 'Noticias', route: '/noticia/teamadmin' });
          if (noticia) {
            items.push({ label: noticia.titulo, route: `/noticia/teamadmin/view/${noticia.id}` });
          }
          items.push({ label: 'Puntuaciones', route: noticia ? `/puntuacion/teamadmin/noticia/${noticia.id}` : '/puntuacion/teamadmin' });
          items.push({ label: 'Puntuación' });
          this.breadcrumbItems.set(items);
        },
        error: () => {},
      });
    }
  }
}
