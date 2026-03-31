import { Component, inject, Input, OnInit, Signal, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { INoticia } from '../../../../model/noticia';
import { DatetimePipe } from '../../../../pipe/datetime-pipe';
import { NoticiaService } from '../../../../service/noticia';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../shared/breadcrumb/breadcrumb';

@Component({
  selector: 'app-noticia-teamadmin-detail',
  imports: [DatetimePipe, RouterLink, CommonModule, BreadcrumbComponent],
  templateUrl: './detail.html',
  styleUrl: './detail.css',
})
export class NoticiaTeamadminDetail implements OnInit {
  @Input() id: Signal<number> = signal(0);

  private oNoticiaService = inject(NoticiaService);

  oNoticia = signal<INoticia | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  breadcrumbItems = signal<BreadcrumbItem[]>([
    { label: 'Mis Clubes', route: '/club/teamadmin' },
    { label: 'Noticias', route: '/noticia/teamadmin' },
    { label: 'Noticia' },
  ]);

  ngOnInit(): void {
    this.load(this.id());
  }

  load(id: number) {
    this.oNoticiaService.getById(id).subscribe({
      next: (data: INoticia) => {
        this.oNoticia.set(data);
        this.loading.set(false);
        const club = data.club;
        this.breadcrumbItems.set([
          { label: 'Mis Clubes', route: '/club/teamadmin' },
          ...(club ? [{ label: club.nombre, route: `/club/teamadmin/view/${club.id}` }] : []),
          { label: 'Noticias', route: club ? `/noticia/teamadmin/club/${club.id}` : '/noticia/teamadmin' },
          { label: data.titulo.length > 40 ? data.titulo.substring(0, 40) + '...' : data.titulo },
        ]);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando la noticia');
        this.loading.set(false);
        console.error(err);
      },
    });
  }
}
