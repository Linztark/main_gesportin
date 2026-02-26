import { Component, OnInit, Input, Output, EventEmitter, inject, signal, effect } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { CuotaService } from '../../../service/cuota';
import { EquipoService } from '../../../service/equipo';
import { ICuota } from '../../../model/cuota';
import { IEquipo } from '../../../model/equipo';
import { EquipoPlistAdminUnrouted } from '../../equipo/plist-admin-unrouted/equipo-plist-admin-unrouted';

@Component({
  selector: 'app-cuota-form-unrouted',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cuota-form.html',
  styleUrls: ['./cuota-form.css'],
})
export class CuotaFormAdminUnrouted implements OnInit {
  @Input() cuota: ICuota | null = null;
  @Input() mode: 'create' | 'edit' = 'create';
  @Output() formSuccess = new EventEmitter<void>();
  @Output() formCancel = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private oCuotaService = inject(CuotaService);
  private oEquipoService = inject(EquipoService);
  private dialog = inject(MatDialog);

  cuotaForm!: FormGroup;
  loading = signal(false);
  error = signal<string | null>(null);
  submitting = signal(false);
  equipos = signal<IEquipo[]>([]);
  selectedEquipo = signal<IEquipo | null>(null);
  displayIdEquipo = signal<number | null>(null);

  constructor() {
    effect(() => {
      const input = this.cuota;
      if (input && this.cuotaForm) {
        this.loadCuotaData(input);
      }
    });
  }

  ngOnInit(): void {
    this.initForm();
    this.loadEquipos();

    if (this.cuota) {
      this.loadCuotaData(this.cuota);
    }
  }

  private initForm(): void {
    this.cuotaForm = this.fb.group({
      id: [{ value: 0, disabled: true }],
      descripcion: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      cantidad: [0, [Validators.required, Validators.min(0)]],
      fecha: ['', [Validators.required]],
      id_equipo: [null, Validators.required],
    });

    this.cuotaForm.get('id_equipo')?.valueChanges.subscribe((id) => {
      if (id) {
        this.loadEquipo(Number(id));
      } else {
        this.selectedEquipo.set(null);
        this.displayIdEquipo.set(null);
      }
    });
  }

  private loadCuotaData(c: ICuota): void {
    this.cuotaForm.patchValue({
      id: c.id ?? 0,
      descripcion: c.descripcion ?? '',
      cantidad: c.cantidad ?? 0,
      fecha: c.fecha ? c.fecha.substring(0, 10) : '',
      id_equipo: c.equipo?.id ?? null,
    });
    if (c.equipo?.id) {
      this.syncEquipo(c.equipo.id);
    }
  }

  private syncEquipo(idEquipo: number | null | undefined): void {
    if (!idEquipo) {
      this.selectedEquipo.set(null);
      this.displayIdEquipo.set(null);
      return;
    }
    this.oEquipoService.get(idEquipo).subscribe({
      next: (equipo: IEquipo) => {
        this.selectedEquipo.set(equipo);
        this.displayIdEquipo.set(equipo.id ?? null);
      },
      error: (err: HttpErrorResponse) => {
        this.selectedEquipo.set(null);
        console.error(err);
        this.snackBar.open('Error al cargar el equipo seleccionado', 'Cerrar', { duration: 3000 });
      },
    });
  }

  openEquipoFinderModal(): void {
    const dialogRef = this.dialog.open(EquipoPlistAdminUnrouted, {
      height: '800px',
      width: '1100px',
      maxWidth: '95vw',
      panelClass: 'equipo-dialog',
      data: { title: 'Elegir equipo', message: 'Plist finder' },
    });

    dialogRef.afterClosed().subscribe((equipo: IEquipo | null) => {
      if (equipo) {
        this.cuotaForm.patchValue({ id_equipo: equipo.id });
        this.syncEquipo(equipo.id);
        this.snackBar.open(`Equipo seleccionado: ${equipo.nombre}`, 'Cerrar', { duration: 3000 });
      }
    });
  }

  private loadEquipos(): void {
    this.oEquipoService.getPage(0, 1000, 'nombre', 'asc').subscribe({
      next: (page) => {
        this.equipos.set(page.content);
        const idActual = this.cuotaForm.get('id_equipo')?.value;
        if (idActual) {
          this.syncEquipo(Number(idActual));
        }
      },
      error: (err: HttpErrorResponse) => {
        this.snackBar.open('Error cargando equipos', 'Cerrar', { duration: 4000 });
        console.error(err);
      },
    });
  }

  private loadEquipo(id: number): void {
    this.oEquipoService.get(id).subscribe({
      next: (eq) => {
        this.selectedEquipo.set(eq);
        this.displayIdEquipo.set(eq.id ?? null);
      },
      error: (err: HttpErrorResponse) => {
        this.selectedEquipo.set(null);
        console.error(err);
      },
    });
  }

  get descripcion() {
    return this.cuotaForm.get('descripcion');
  }

  get cantidad() {
    return this.cuotaForm.get('cantidad');
  }

  get fecha() {
    return this.cuotaForm.get('fecha');
  }

  get id_equipo() {
    return this.cuotaForm.get('id_equipo');
  }

  onSubmit(): void {
    if (this.cuotaForm.invalid) {
      this.snackBar.open('Por favor, complete todos los campos correctamente', 'Cerrar', { duration: 4000 });
      this.cuotaForm.markAllAsTouched();
      return;
    }

    this.submitting.set(true);

    const fechaForm: string = this.cuotaForm.value.fecha;
    const fechaLocalDateTime = fechaForm
      ? fechaForm.length > 10
        ? fechaForm.replace('T', ' ')
        : `${fechaForm} 00:00:00`
      : null;

    const cuotaData: any = {
      descripcion: this.cuotaForm.value.descripcion,
      cantidad: this.cuotaForm.value.cantidad,
      fecha: fechaLocalDateTime,
      equipo: { id: this.cuotaForm.value.id_equipo },
    };

    if (this.mode === 'edit' && this.cuota?.id) {
      cuotaData.id = this.cuota.id;
      this.oCuotaService.update(cuotaData).subscribe({
        next: () => {
          this.snackBar.open('Cuota actualizada exitosamente', 'Cerrar', { duration: 4000 });
          this.submitting.set(false);
          this.formSuccess.emit();
        },
        error: (err: HttpErrorResponse) => {
          this.error.set('Error actualizando la cuota');
          this.snackBar.open('Error actualizando la cuota', 'Cerrar', { duration: 4000 });
          console.error(err);
          this.submitting.set(false);
        },
      });
    } else {
      this.oCuotaService.create(cuotaData).subscribe({
        next: () => {
          this.snackBar.open('Cuota creada exitosamente', 'Cerrar', { duration: 4000 });
          this.submitting.set(false);
          this.formSuccess.emit();
        },
        error: (err: HttpErrorResponse) => {
          this.error.set('Error creando la cuota');
          this.snackBar.open('Error creando la cuota', 'Cerrar', { duration: 4000 });
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
