import { Component, OnInit, inject, input, computed, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { TemporadaService } from '../../../service/temporada';
import { ClubService } from '../../../service/club';
import { ITemporada } from '../../../model/temporada';
import { IClub } from '../../../model/club';
import { ClubPlistAdminUnrouted } from '../../club/plist-admin-unrouted/club-plist-admin-unrouted';

@Component({
  selector: 'app-temporada-form-unrouted',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './temporada-form-unrouted.html',
  styleUrl: './temporada-form-unrouted.css',
})
export class TemporadaFormAdminUnrouted implements OnInit {
  id = input<number>(0);

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private oTemporadaService = inject(TemporadaService);
  private oClubService = inject(ClubService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  temporadaForm!: FormGroup;
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  submitting = signal<boolean>(false);
  
  action = computed(() => (this.id() > 0 ? 'Editar' : 'Crear'));
  title = computed(() => (this.id() > 0 ? 'Edición de Temporada' : 'Nueva Temporada'));

  selectedClub = signal<IClub | null>(null);

  ngOnInit(): void {
    this.initForm();
    if (this.id() > 0) {
      this.getTemporada(this.id());
    } else {
      this.loading.set(false);
    }
  }

  initForm(): void {
    this.temporadaForm = this.fb.group({
      id: [{ value: '', disabled: true }], 
      descripcion: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      id_club: [null, [Validators.required]],
    });
  }

  getTemporada(id: number): void {
    this.oTemporadaService.get(id).subscribe({
      next: (data: ITemporada) => {
        this.syncClub(data.club.id);
        this.temporadaForm.patchValue({
          id: data.id,
          descripcion: data.descripcion,
          id_club: data.club.id,
        });
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error al cargar el registro');
        this.loading.set(false);
      },
    });
  }

  onSubmit(): void {
    if (this.temporadaForm.invalid) {
      this.temporadaForm.markAllAsTouched();
      return;
    }

    this.submitting.set(true);

    const formValue = this.temporadaForm.getRawValue();
    const payload: any = {
      descripcion: formValue.descripcion,
      club: { id: Number(formValue.id_club) }
    };

    if (this.id() > 0) {
      payload.id = this.id();
      this.oTemporadaService.update(payload).subscribe({
        next: () => this.handleSuccess('actualizada'),
        error: (err) => this.handleError(err)
      });
    } else {
      this.oTemporadaService.create(payload).subscribe({
        next: () => this.handleSuccess('creada'),
        error: (err) => this.handleError(err)
      });
    }
  }

  private handleSuccess(actionMsg: string) {
    this.submitting.set(false);
    if (this.temporadaForm) {
      this.temporadaForm.markAsPristine();
    }
    this.snackBar.open(`Temporada ${actionMsg} correctamente`, 'Cerrar', { duration: 3000 });
    this.router.navigate(['/temporada']);
  }

  private handleError(err: HttpErrorResponse) {
    this.submitting.set(false);
    this.snackBar.open('Error en la operación', 'Cerrar', { duration: 4000 });
  }

  private syncClub(idClub: number): void {
      this.oClubService.get(idClub).subscribe({
          next: (club: IClub) => { this.selectedClub.set(club); },
          error: (err) => { console.error(err); }
      });
  }
  
  openClubFinderModal(): void {
      const dialogRef = this.dialog.open(ClubPlistAdminUnrouted, {
          height: '800px', width: '1100px', maxWidth: '95vw',
          panelClass: 'club-dialog',
          data: { title: 'Seleccionar Club', message: 'Busca y selecciona un club' },
      });
      dialogRef.afterClosed().subscribe((club: IClub | null) => {
          if (club) {
              this.temporadaForm.patchValue({ id_club: club.id });
              this.syncClub(club.id);
              this.snackBar.open(`Club seleccionado: ${club.nombre}`, 'Cerrar', { duration: 3000 });
          }
      });
  }
}