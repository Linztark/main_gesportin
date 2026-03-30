import { Component, OnInit, Input, Output, EventEmitter, inject, signal, effect } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ModalService } from '../../../shared/modal/modal.service';
import { TipoarticuloService } from '../../../../service/tipoarticulo';
import { ClubService } from '../../../../service/club';
import { ClubAdminPlist } from '../../../club/admin/plist/plist';
import { ITipoarticulo } from '../../../../model/tipoarticulo';
import { IClub } from '../../../../model/club';
import { SessionService } from '../../../../service/session';

@Component({
  selector: 'app-tipoarticulo-admin-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form.html',
  styleUrl: './form.css',
})
export class TipoarticuloAdminForm implements OnInit {
  @Input() tipoarticulo: ITipoarticulo | null = null;
  @Input() isEditMode: boolean = false;
  @Output() formSuccess = new EventEmitter<void>();
  @Output() formCancel = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private oTipoarticuloService = inject(TipoarticuloService);
  private oClubService = inject(ClubService);
  private modalService = inject(ModalService);
  private sessionService = inject(SessionService);

  tipoarticuloForm!: FormGroup;
  error = signal<string | null>(null);
  submitting = signal(false);
  selectedClub = signal<IClub | null>(null);

  constructor() {
    effect(() => {
      const t = this.tipoarticulo;
      if (t && this.tipoarticuloForm) {
        this.loadTipoarticuloData(t);
      }
    });
  }

  ngOnInit(): void {
    this.initForm();

    if (this.tipoarticulo) {
      this.loadTipoarticuloData(this.tipoarticulo);
    }
  }

  private initForm(): void {
    this.tipoarticuloForm = this.fb.group({
      id: [{ value: 0, disabled: true }],
      descripcion: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      id_club: [null, Validators.required],
    });
  }

  private loadTipoarticuloData(tipoarticulo: ITipoarticulo): void {
    this.tipoarticuloForm.patchValue({
      id: tipoarticulo.id,
      descripcion: tipoarticulo.descripcion,
      id_club: tipoarticulo.club?.id,
    });
    if (tipoarticulo.club?.id) {
      this.loadClub(tipoarticulo.club.id);
    }
  }

  private loadClub(idClub: number): void {
    this.oClubService.get(idClub).subscribe({
      next: (club) => this.selectedClub.set(club),
      error: () => this.selectedClub.set(null),
    });
  }

  openClubFinderModal(): void {
    const ref = this.modalService.open<unknown, IClub | null>(ClubAdminPlist);
    ref.afterClosed$.subscribe((club: IClub | null) => {
      if (club?.id != null) {
        this.tipoarticuloForm.patchValue({ id_club: club.id });
        this.selectedClub.set(club);
        this.snackBar.open(`Club seleccionado: ${club.nombre}`, 'Cerrar', { duration: 3000 });
      }
    });
  }

  get descripcion() {
    return this.tipoarticuloForm.get('descripcion');
  }

  get id_club() {
    return this.tipoarticuloForm.get('id_club');
  }

  onSubmit(): void {
    if (this.tipoarticuloForm.invalid) {
      this.snackBar.open('Por favor, complete todos los campos correctamente', 'Cerrar', { duration: 4000 });
      return;
    }

    this.submitting.set(true);

    const tipoarticuloData: any = {
      descripcion: this.tipoarticuloForm.value.descripcion,
      club: { id: Number(this.tipoarticuloForm.value.id_club) },
    };

    if (this.isEditMode && this.tipoarticulo?.id) {
      tipoarticuloData.id = this.tipoarticulo.id;
      this.oTipoarticuloService.update(tipoarticuloData).subscribe({
        next: () => {
          this.snackBar.open('Tipo de artículo actualizado exitosamente', 'Cerrar', { duration: 4000 });
          this.submitting.set(false);
          this.formSuccess.emit();
        },
        error: (err: HttpErrorResponse) => {
          this.error.set('Error actualizando el tipo de artículo');
          this.snackBar.open('Error actualizando el tipo de artículo', 'Cerrar', { duration: 4000 });
          console.error(err);
          this.submitting.set(false);
        },
      });
    } else {
      this.oTipoarticuloService.create(tipoarticuloData).subscribe({
        next: () => {
          this.snackBar.open('Tipo de artículo creado exitosamente', 'Cerrar', { duration: 4000 });
          this.submitting.set(false);
          this.formSuccess.emit();
        },
        error: (err: HttpErrorResponse) => {
          this.error.set('Error creando el tipo de artículo');
          this.snackBar.open('Error creando el tipo de artículo', 'Cerrar', { duration: 4000 });
          console.error(err);
          this.submitting.set(false);
        },
      });
    }
  }

  onCancel(): void {
    this.formCancel.emit();
  }
}
