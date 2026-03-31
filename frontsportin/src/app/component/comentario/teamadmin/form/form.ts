import { Component, OnInit, inject, signal, input } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ModalService } from '../../../shared/modal/modal.service';
import { ComentarioService } from '../../../../service/comentario';
import { UsuarioService } from '../../../../service/usuarioService';
import { NoticiaService } from '../../../../service/noticia';
import { IComentario } from '../../../../model/comentario';
import { IUsuario } from '../../../../model/usuario';
import { INoticia } from '../../../../model/noticia';
import { SessionService } from '../../../../service/session';
import { UsuarioAdminPlist } from '../../../usuario/admin/plist/plist';
import { NoticiaAdminPlist } from '../../../noticia/admin/plist/plist';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../shared/breadcrumb/breadcrumb';

@Component({
  selector: 'app-comentario-teamadmin-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BreadcrumbComponent],
  templateUrl: './form.html',
  styleUrl: './form.css',
})
export class ComentarioTeamadminForm implements OnInit {
  id = input<number>(0);
  returnUrl = input<string>('/comentario/teamadmin');
  idNoticia = input<number>(0);

  private router = inject(Router);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private oComentarioService = inject(ComentarioService);
  private oUsuarioService = inject(UsuarioService);
  private oNoticiaService = inject(NoticiaService);
  private modalService = inject(ModalService);
  sessionService = inject(SessionService);

  comentarioForm!: FormGroup;
  error = signal<string | null>(null);
  loading = signal<boolean>(false);
  submitting = signal(false);
  selectedUsuario = signal<IUsuario | null>(null);
  selectedNoticia = signal<INoticia | null>(null);
  breadcrumbItems = signal<BreadcrumbItem[]>([
    { label: 'Mis Clubes', route: '/club/teamadmin' },
    { label: 'Noticias', route: '/noticia/teamadmin' },
    { label: 'Comentarios', route: '/comentario/teamadmin' },
    { label: 'Nuevo Comentario' },
  ]);

  ngOnInit(): void {
    this.initForm();

    if (this.id() > 0) {
      this.loadById(this.id());
    } else {
      if (this.idNoticia() > 0) {
        this.comentarioForm.patchValue({ id_noticia: this.idNoticia() });
        this.loadNoticia(this.idNoticia());
      }
      this.loading?.set(false);
    }
  }

  private initForm(): void {
    this.comentarioForm = this.fb.group({
      id: [{ value: 0, disabled: true }],
      contenido: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(1000)]],
      id_usuario: [null, Validators.required],
      id_noticia: [null, Validators.required],
    });
  }

  private loadById(id: number): void {
    this.loading.set(true);
    this.oComentarioService.get(id).subscribe({
      next: (data: IComentario) => {
        this.loadComentarioData(data);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando el registro');
        this.loading.set(false);
        console.error(err);
      },
    });
  }

  private loadComentarioData(comentario: IComentario): void {
    this.comentarioForm.patchValue({
      id: comentario.id,
      contenido: comentario.contenido ?? '',
      id_usuario: comentario.usuario?.id ?? null,
      id_noticia: comentario.noticia?.id ?? null,
    });
    const noticia = comentario.noticia;
    if (noticia) {
      const titulo = noticia.titulo;
      this.breadcrumbItems.set([
        { label: 'Mis Clubes', route: '/club/teamadmin' },
        { label: 'Noticias', route: '/noticia/teamadmin' },
        { label: titulo.length > 40 ? titulo.substring(0, 40) + '…' : titulo, route: `/noticia/teamadmin/view/${noticia.id}` },
        { label: 'Comentarios', route: `/comentario/teamadmin/noticia/${noticia.id}` },
        { label: `#${comentario.id}`, route: `/comentario/teamadmin/view/${comentario.id}` },
        { label: 'Editar' },
      ]);
    }
    if (comentario.usuario?.id) this.loadUsuario(comentario.usuario.id);
    if (comentario.noticia?.id) this.loadNoticia(comentario.noticia.id);
  }

  private loadUsuario(idUsuario: number): void {
    this.oUsuarioService.get(idUsuario).subscribe({
      next: (usuario) => this.selectedUsuario.set(usuario),
      error: () => this.selectedUsuario.set(null),
    });
  }

  private loadNoticia(idNoticia: number): void {
    this.oNoticiaService.getById(idNoticia).subscribe({
      next: (noticia) => {
        this.selectedNoticia.set(noticia);
        if (this.id() === 0) {
          const titulo = noticia.titulo;
          this.breadcrumbItems.set([
            { label: 'Mis Clubes', route: '/club/teamadmin' },
            { label: 'Noticias', route: '/noticia/teamadmin' },
            { label: titulo.length > 40 ? titulo.substring(0, 40) + '…' : titulo, route: `/noticia/teamadmin/view/${noticia.id}` },
            { label: 'Comentarios', route: `/comentario/teamadmin/noticia/${noticia.id}` },
            { label: 'Nuevo Comentario' },
          ]);
        }
      },
      error: () => this.selectedNoticia.set(null),
    });
  }

  get contenido() { return this.comentarioForm.get('contenido'); }
  get id_usuario() { return this.comentarioForm.get('id_usuario'); }
  get id_noticia() { return this.comentarioForm.get('id_noticia'); }

  openUsuarioFinderModal(): void {
    const ref = this.modalService.open<unknown, IUsuario | null>(UsuarioAdminPlist);
    ref.afterClosed$.subscribe((usuario: IUsuario | null) => {
      if (usuario?.id != null) {
        this.comentarioForm.patchValue({ id_usuario: usuario.id });
        this.selectedUsuario.set(usuario);
        this.snackBar.open(`Usuario seleccionado: ${usuario.nombre}`, 'Cerrar', { duration: 3000 });
      }
    });
  }

  openNoticiaFinderModal(): void {
    const ref = this.modalService.open<unknown, INoticia | null>(NoticiaAdminPlist);
    ref.afterClosed$.subscribe((noticia: INoticia | null) => {
      if (noticia?.id != null) {
        this.comentarioForm.patchValue({ id_noticia: noticia.id });
        this.selectedNoticia.set(noticia);
        this.snackBar.open(`Noticia seleccionada: ${noticia.titulo}`, 'Cerrar', { duration: 3000 });
      }
    });
  }

  onSubmit(): void {
    if (this.comentarioForm.invalid) {
      this.snackBar.open('Por favor, complete todos los campos correctamente', 'Cerrar', { duration: 4000 });
      return;
    }

    this.submitting.set(true);

    const comentarioData: any = {
      contenido: this.comentarioForm.value.contenido,
      usuario: { id: Number(this.comentarioForm.value.id_usuario) },
      noticia: { id: Number(this.comentarioForm.value.id_noticia) },
    };

    if (this.id() > 0) {
      comentarioData.id = this.id();
      this.oComentarioService.update(comentarioData).subscribe({
        next: () => {
          this.snackBar.open('Comentario actualizado exitosamente', 'Cerrar', { duration: 4000 });
          this.submitting.set(false);
          this.router.navigate([this.returnUrl()]);
        },
        error: (err: HttpErrorResponse) => {
          this.error.set('Error actualizando el comentario');
          this.snackBar.open('Error actualizando el comentario', 'Cerrar', { duration: 4000 });
          console.error(err);
          this.submitting.set(false);
        },
      });
    } else {
      this.oComentarioService.create(comentarioData).subscribe({
        next: () => {
          this.snackBar.open('Comentario creado exitosamente', 'Cerrar', { duration: 4000 });
          this.submitting.set(false);
          this.router.navigate([this.returnUrl()]);
        },
        error: (err: HttpErrorResponse) => {
          this.error.set('Error creando el comentario');
          this.snackBar.open('Error creando el comentario', 'Cerrar', { duration: 4000 });
          console.error(err);
          this.submitting.set(false);
        },
      });
    }
  }

  onCancel(): void {
    this.router.navigate([this.returnUrl()]);
  }
}
