import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoticiaService } from '../../../../service/noticia';
import { INoticia } from '../../../../model/noticia';
import { NoticiaAdminForm } from '../../../../component/noticia/admin/form/form';

@Component({
  selector: 'app-noticia-admin-edit-page',
  imports: [CommonModule, NoticiaAdminForm],
  templateUrl: './edit.html',
  styleUrl: './edit.css',
})
export class NoticiaAdminEditPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private noticiaService = inject(NoticiaService);
  private snackBar = inject(MatSnackBar);

  id_noticia = signal<number>(0);
  loading = signal(true);
  error = signal<string | null>(null);
  noticia = signal<INoticia | null>(null);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (!idParam || idParam === '0') {
      this.error.set('ID de noticia no válido');
      this.loading.set(false);
      return;
    }

    const id = Number(idParam);
    if (isNaN(id)) {
      this.error.set('ID no válido');
      this.loading.set(false);
      return;
    }

    this.id_noticia.set(id);
    this.loadNoticia();
  }

  private loadNoticia(): void {
    this.noticiaService.getById(this.id_noticia()).subscribe({
      next: (n: INoticia) => {
        this.noticia.set(n);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando la noticia');
        this.snackBar.open('Error cargando la noticia', 'Cerrar', { duration: 4000 });
        console.error(err);
        this.loading.set(false);
      },
    });
  }

  onFormSuccess(): void {
    this.router.navigate(['/noticia']);
  }

  onFormCancel(): void {
    this.router.navigate(['/noticia']);
  }
}
