import { Component, OnInit, Input, Output, EventEmitter, inject, signal } from '@angular/core';
import { toIsoDateTime } from '../../../../utils/date-utils';
import { SessionService } from '../../../../service/session';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { INoticia } from '../../../../model/noticia';
import { IClub } from '../../../../model/club';
import { ClubService } from '../../../../service/club';
import { NoticiaService } from '../../../../service/noticia';
import { ClubAdminPlist } from '../../../club/admin/plist/plist';

@Component({
  selector: 'app-noticia-admin-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form.html',
  styleUrl: './form.css',
})
export class NoticiaAdminForm implements OnInit {
  @Input() noticia: INoticia | null = null;
  @Input() isEditMode: boolean = false;
  @Output() formSuccess = new EventEmitter<void>();
  @Output() formCancel = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private oClubService = inject(ClubService);
  private oNoticiaService = inject(NoticiaService);
  private snackBar = inject(MatSnackBar);
  session: SessionService = inject(SessionService);

  noticiaForm!: FormGroup;
  loading = signal(false);
  submitting = signal(false);
  clubes = signal<IClub[]>([]);
  selectedClub = signal<IClub | null>(null);
  displayIdClub = signal<number | null>(null);

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.initForm();
    this.loadClubs();

    if (this.noticia) {
      this.loadNoticiaData();
    }
  }

  private initForm(): void {
    this.noticiaForm = this.fb.group({
      id: [{ value: 0, disabled: true }],
      titulo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      contenido: ['', [Validators.required, Validators.minLength(3)]],
      fecha: [new Date().toISOString().split('T')[0], Validators.required],
      imagen: [null],
      id_club: [null, Validators.required],
    });

    if (this.session.isClubAdmin()) {
      const clubId = this.session.getClubId();
      if (clubId != null) {
        this.noticiaForm.patchValue({ id_club: clubId });
        this.noticiaForm.get('id_club')?.disable();
        this.loadClub(clubId);
      }
    }

    this.noticiaForm.get('id_club')?.valueChanges.subscribe((id) => {
      if (id) {
        const idNumero = typeof id === 'string' ? parseInt(id, 10) : id;
        this.loadClub(idNumero);
      } else {
        this.selectedClub.set(null);
        this.displayIdClub.set(null);
      }
    });
  }

  private loadNoticiaData(): void {
    if (!this.noticia) return;

    const fechaIso = toIsoDateTime(this.noticia.fecha);
    const fechaInput = fechaIso ? fechaIso.split('T')[0] : '';

    this.noticiaForm.patchValue({
      id: this.noticia.id,
      titulo: this.noticia.titulo,
      contenido: this.noticia.contenido,
      fecha: fechaInput,
      imagen: this.noticia.imagen || null,
      id_club: this.noticia.club?.id,
    });

    if (this.noticia.club) {
      this.syncClub(this.noticia.club.id);
    }
  }

  private loadClub(idClub: number): void {
    this.displayIdClub.set(idClub);
    const c = this.clubes().find((x) => x.id === idClub) || null;
    this.selectedClub.set(c);
  }

  private syncClub(idClub: number): void {
    this.displayIdClub.set(idClub);
    const c = this.clubes().find((x) => x.id === idClub) || null;
    this.selectedClub.set(c);
  }

  private loadClubs(): void {
    if (this.session.isClubAdmin()) {
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    this.oClubService.getPage(0, 1000, 'nombre', 'asc').subscribe({
      next: (page) => {
        this.clubes.set(page.content);
        const idActual = this.noticiaForm.get('id_club')?.value;
        if (idActual) {
          this.syncClub(idActual);
        }
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.snackBar.open('Error cargando clubs', 'Cerrar', { duration: 4000 });
        console.error(err);
        this.loading.set(false);
      },
    });
  }

  get titulo() { return this.noticiaForm.get('titulo'); }
  get contenido() { return this.noticiaForm.get('contenido'); }
  get fecha() { return this.noticiaForm.get('fecha'); }
  get id_club() { return this.noticiaForm.get('id_club'); }

  onSubmit(): void {
    if (this.noticiaForm.invalid) {
      this.snackBar.open('Por favor, complete todos los campos correctamente', 'Cerrar', {
        duration: 4000,
      });
      this.noticiaForm.markAllAsTouched();
      return;
    }

    this.submitting.set(true);

    const fechaConHora = toIsoDateTime(this.noticiaForm.value.fecha);

    const noticiaData: any = {
      titulo: this.noticiaForm.value.titulo,
      contenido: this.noticiaForm.value.contenido,
      fecha: fechaConHora,
      imagen: this.noticiaForm.value.imagen || null,
      club: {
        id: this.session.isClubAdmin()
          ? this.session.getClubId()
          : this.noticiaForm.value.id_club,
      },
      comentarios: [],
      puntuaciones: [],
    };

    if (this.isEditMode && this.noticia?.id) {
      noticiaData.id = this.noticia.id;
      this.oNoticiaService.update(noticiaData).subscribe({
        next: () => {
          this.snackBar.open('Noticia actualizada', 'Cerrar', { duration: 4000 });
          this.submitting.set(false);
          this.formSuccess.emit();
        },
        error: (err: HttpErrorResponse) => {
          this.snackBar.open('Error actualizando la noticia', 'Cerrar', { duration: 4000 });
          console.error(err);
          this.submitting.set(false);
        },
      });
    } else {
      this.oNoticiaService.create(noticiaData).subscribe({
        next: () => {
          this.snackBar.open('Noticia creada', 'Cerrar', { duration: 4000 });
          this.submitting.set(false);
          this.formSuccess.emit();
        },
        error: (err: HttpErrorResponse) => {
          this.snackBar.open('Error creando la noticia', 'Cerrar', { duration: 4000 });
          console.error(err);
          this.submitting.set(false);
        },
      });
    }
  }

  onCancel(): void {
    this.formCancel.emit();
  }

  openClubFinderModal(): void {
    const dialogRef = this.dialog.open(ClubAdminPlist, {
      height: '800px',
      width: '1300px',
      maxWidth: '95vw',
      panelClass: 'club-dialog',
      data: {
        title: 'Aqui elegir club',
        message: 'Plist finder para encontrar el club y asignarlo a la noticia',
      },
    });

    dialogRef.afterClosed().subscribe((club: IClub | null) => {
      if (club) {
        this.noticiaForm.patchValue({ id_club: club.id });
        this.syncClub(club.id);
        this.snackBar.open(`Club seleccionado: ${club.nombre}`, 'Cerrar', { duration: 3000 });
      }
    });
  }
}
