import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NoticiaTeamadminForm } from '../../../../component/noticia/teamadmin/form/form';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';
import { NoticiaService } from '../../../../service/noticia';

@Component({
  selector: 'app-noticia-teamadmin-edit-page',
  imports: [NoticiaTeamadminForm, BreadcrumbComponent],
  template: '<app-breadcrumb [items]=\"breadcrumbItems()\"></app-breadcrumb><app-noticia-teamadmin-form [id]="id_noticia()" [returnUrl]="returnUrl"></app-noticia-teamadmin-form>',
})
export class NoticiaTeamadminEditPage implements OnInit {
  breadcrumbItems = signal<BreadcrumbItem[]>([
    { label: 'Mis Clubes', route: '/club/teamadmin' },
    { label: 'Noticias', route: '/noticia/teamadmin' },
    { label: 'Editar Noticia' },
  ]);

  private route = inject(ActivatedRoute);
  private noticiaService = inject(NoticiaService);
  id_noticia = signal<number>(0);
  returnUrl = '/noticia/teamadmin';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const n = id ? Number(id) : NaN;
    this.id_noticia.set(n);
    if (!isNaN(n)) {
      this.noticiaService.getById(n).subscribe({
        next: (noticia) => {
          const items: BreadcrumbItem[] = [{ label: 'Mis Clubes', route: '/club/teamadmin' }];
          if (noticia.club) {
            items.push({ label: noticia.club.nombre, route: `/club/teamadmin/view/${noticia.club.id}` });
          }
          items.push({ label: 'Noticias', route: '/noticia/teamadmin' });
          items.push({ label: noticia.titulo, route: `/noticia/teamadmin/view/${noticia.id}` });
          items.push({ label: 'Editar Noticia' });
          this.breadcrumbItems.set(items);
        },
        error: () => {},
      });
    }
  }
}
