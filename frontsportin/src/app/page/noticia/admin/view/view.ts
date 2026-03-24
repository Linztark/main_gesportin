import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { NoticiaService } from '../../../../service/noticia';
import { INoticia } from '../../../../model/noticia';
import { NoticiaAdminDetail } from '../../../../component/noticia/admin/detail/detail';

@Component({
  selector: 'app-noticia-admin-view-page',
  imports: [NoticiaAdminDetail],
  templateUrl: './view.html',
  styleUrl: './view.css',
})
export class NoticiaAdminViewPage implements OnInit {
  private route = inject(ActivatedRoute);
  private noticiaService = inject(NoticiaService);

  oNoticia = signal<INoticia | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  id_noticia = signal<number>(0);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.id_noticia.set(idParam ? Number(idParam) : NaN);

    if (isNaN(this.id_noticia())) {
      this.error.set('ID no valido');
      this.loading.set(false);
      return;
    }

    this.load(this.id_noticia());
  }

  private load(id: number) {
    this.noticiaService.getById(id).subscribe({
      next: (data: INoticia) => {
        this.oNoticia.set(data);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error al recuperar la noticia: ' + err.message);
        this.loading.set(false);
        console.error(err);
      },
    });
  }
}
