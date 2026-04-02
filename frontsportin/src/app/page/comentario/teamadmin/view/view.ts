import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ComentarioTeamadminDetail } from '../../../../component/comentario/teamadmin/detail/detail';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';
import { ComentarioService } from '../../../../service/comentario';

@Component({
  selector: 'app-comentario-teamadmin-view-page',
  imports: [ComentarioTeamadminDetail, BreadcrumbComponent],
  template: '<app-breadcrumb [items]=\"breadcrumbItems()\"></app-breadcrumb><app-comentario-teamadmin-detail [id]="id_comentario"></app-comentario-teamadmin-detail>',
})
export class ComentarioTeamadminViewPage implements OnInit {
  breadcrumbItems = signal<BreadcrumbItem[]>([
    { label: 'Mis Clubes', route: '/club/teamadmin' },
    { label: 'Noticias', route: '/noticia/teamadmin' },
    { label: 'Comentarios', route: '/comentario/teamadmin' },
    { label: 'Comentario' },
  ]);

  private route = inject(ActivatedRoute);
  private comentarioService = inject(ComentarioService);
  id_comentario = signal<number>(0);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const n = id ? Number(id) : NaN;
    this.id_comentario.set(n);
    if (!isNaN(n)) {
      this.comentarioService.get(n).subscribe({
        next: (com) => {
          const noticia = com.noticia;
          const items: BreadcrumbItem[] = [{ label: 'Mis Clubes', route: '/club/teamadmin' }];
          if (noticia?.club) {
            items.push({ label: noticia.club.nombre, route: `/club/teamadmin/view/${noticia.club.id}` });
          }
          items.push({ label: 'Noticias', route: '/noticia/teamadmin' });
          if (noticia) {
            items.push({ label: noticia.titulo, route: `/noticia/teamadmin/view/${noticia.id}` });
          }
          items.push({ label: 'Comentarios', route: noticia ? `/comentario/teamadmin/noticia/${noticia.id}` : '/comentario/teamadmin' });
          items.push({ label: 'Comentario' });
          this.breadcrumbItems.set(items);
        },
        error: () => {},
      });
    }
  }
}
