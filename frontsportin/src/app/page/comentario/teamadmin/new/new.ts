import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ComentarioTeamadminForm } from '../../../../component/comentario/teamadmin/form/form';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';
import { NoticiaService } from '../../../../service/noticia';

@Component({
  selector: 'app-comentario-teamadmin-new-page',
  imports: [ComentarioTeamadminForm, BreadcrumbComponent],
  template: '<app-breadcrumb [items]=\"breadcrumbItems()\"></app-breadcrumb><app-comentario-teamadmin-form [returnUrl]="returnUrl" [idNoticia]="idNoticia()"></app-comentario-teamadmin-form>',
})
export class ComentarioTeamadminNewPage implements OnInit {
  breadcrumbItems = signal<BreadcrumbItem[]>([
    { label: 'Mis Clubes', route: '/club/teamadmin' },
    { label: 'Noticias', route: '/noticia/teamadmin' },
    { label: 'Comentarios', route: '/comentario/teamadmin' },
    { label: 'Nuevo Comentario' },
  ]);

  private route = inject(ActivatedRoute);
  private noticiaService = inject(NoticiaService);
  returnUrl = '/comentario/teamadmin';
  idNoticia = signal<number>(0);

  ngOnInit(): void {
    const val = this.route.snapshot.queryParamMap.get('id_noticia');
    if (val) {
      const n = Number(val);
      this.idNoticia.set(n);
      this.noticiaService.getById(n).subscribe({
        next: (noticia) => {
          const items: BreadcrumbItem[] = [{ label: 'Mis Clubes', route: '/club/teamadmin' }];
          if (noticia.club) {
            items.push({ label: noticia.club.nombre, route: `/club/teamadmin/view/${noticia.club.id}` });
          }
          items.push({ label: 'Noticias', route: '/noticia/teamadmin' });
          items.push({ label: noticia.titulo, route: `/noticia/teamadmin/view/${noticia.id}` });
          items.push({ label: 'Comentarios', route: `/comentario/teamadmin/noticia/${noticia.id}` });
          items.push({ label: 'Nuevo Comentario' });
          this.breadcrumbItems.set(items);
        },
        error: () => {},
      });
    }
  }
}
