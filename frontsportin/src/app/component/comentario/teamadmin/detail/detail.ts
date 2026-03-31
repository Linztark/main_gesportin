import { Component, signal, OnInit, inject, Input, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { DatetimePipe } from '../../../../pipe/datetime-pipe';
import { ComentarioService } from '../../../../service/comentario';
import { IComentario } from '../../../../model/comentario';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../shared/breadcrumb/breadcrumb';

@Component({
  standalone: true,
  selector: 'app-comentario-teamadmin-detail',
  imports: [CommonModule, RouterLink, DatetimePipe, BreadcrumbComponent],
  templateUrl: './detail.html',
  styleUrl: './detail.css',
})
export class ComentarioTeamadminDetail implements OnInit {
  @Input() id: Signal<number> = signal(0);

  private oComentarioService = inject(ComentarioService);

  oComentario = signal<IComentario | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  breadcrumbItems = signal<BreadcrumbItem[]>([
    { label: 'Mis Clubes', route: '/club/teamadmin' },
    { label: 'Noticias', route: '/noticia/teamadmin' },
    { label: 'Comentarios', route: '/comentario/teamadmin' },
    { label: 'Comentario' },
  ]);

  ngOnInit(): void {
    this.load(this.id());
  }

  load(id: number) {
    this.oComentarioService.get(id).subscribe({
      next: (data: IComentario) => {
        this.oComentario.set(data);
        this.loading.set(false);
        const noticia = data.noticia;
        const titulo = noticia?.titulo ?? '';
        this.breadcrumbItems.set([
          { label: 'Mis Clubes', route: '/club/teamadmin' },
          { label: 'Noticias', route: '/noticia/teamadmin' },
          ...(noticia ? [{ label: titulo.length > 40 ? titulo.substring(0, 40) + '…' : titulo, route: `/noticia/teamadmin/view/${noticia.id}` }] : []),
          { label: 'Comentarios', route: noticia ? `/comentario/teamadmin/noticia/${noticia.id}` : '/comentario/teamadmin' },
          { label: `#${data.id}` },
        ]);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando el comentario');
        this.loading.set(false);
        console.error(err);
      },
    });
  }
}
