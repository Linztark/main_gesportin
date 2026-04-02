import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { NoticiaService } from '../../../../service/noticia';
import { NotificacionService } from '../../../../service/notificacion';;
import { NoticiaTeamadminDetail } from '../../../../component/noticia/teamadmin/detail/detail';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';

@Component({
  selector: 'app-noticia-teamadmin-delete-page',
  imports: [NoticiaTeamadminDetail, BreadcrumbComponent],
  templateUrl: './delete.html',
})
export class NoticiaTeamadminDeletePage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private noticiaService = inject(NoticiaService);
  private notificacion = inject(NotificacionService);
  error = signal<string | null>(null);
  breadcrumbItems = signal<BreadcrumbItem[]>([
    { label: 'Mis Clubes', route: '/club/teamadmin' },
    { label: 'Noticias', route: '/noticia/teamadmin' },
    { label: 'Eliminar Noticia' },
  ]);
  id_noticia = signal<number>(0);

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
          items.push({ label: 'Eliminar Noticia' });
          this.breadcrumbItems.set(items);
        },
        error: () => { this.error.set('Error cargando el registro'); },
      });
    } else {
      this.error.set('ID no válido');
    }
  }

  doDelete(): void {
    this.noticiaService.delete(this.id_noticia()).subscribe({
      next: () => {
        this.notificacion.info('Noticia eliminado/a');
        this.router.navigate(['/noticia/teamadmin']);
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
