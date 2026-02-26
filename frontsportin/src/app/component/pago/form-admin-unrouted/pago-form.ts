import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  inject,
  signal,
  effect,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { PagoService } from '../../../service/pago';
import { CuotaService } from '../../../service/cuota';
import { JugadorService } from '../../../service/jugador-service';
import { IPago } from '../../../model/pago';
import { ICuota } from '../../../model/cuota';
import { IJugador } from '../../../model/jugador';
import { CuotaPlistAdminUnrouted } from '../../cuota/plist-admin-unrouted/cuota-plist-admin-unrouted';
import { JugadorPlistAdminUnrouted } from '../../jugador/plist-admin-unrouted/jugador-plist-admin-unrouted';

@Component({
  selector: 'app-pago-form-unrouted',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pago-form.html',
  styleUrls: ['./pago-form.css'],
})
export class PagoFormAdminUnrouted implements OnInit {
  @Input() pago: IPago | null = null;
  @Input() mode: 'create' | 'edit' = 'create';
  @Output() formSuccess = new EventEmitter<void>();
  @Output() formCancel = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private oPagoService = inject(PagoService);
  private oCuotaService = inject(CuotaService);
  private oJugadorService = inject(JugadorService);
  private dialog = inject(MatDialog);

  pagoForm!: FormGroup;
  loading = signal(false);
  error = signal<string | null>(null);
  submitting = signal(false);
  selectedCuota = signal<ICuota | null>(null);
  selectedJugador = signal<IJugador | null>(null);

  constructor() {
    effect(() => {
      const pagoData = this.pago;
      if (pagoData && this.pagoForm) {
        this.loadPagoData(pagoData);
      }
    });
  }

  ngOnInit(): void {
    this.initForm();

    if (this.pago) {
      this.loadPagoData(this.pago);
    }
  }

  private initForm(): void {
    this.pagoForm = this.fb.group({
      id: [{ value: 0, disabled: true }],
      abonado: [false],
      fecha: ['', [Validators.required]],
      id_cuota: [null, [Validators.required]],
      id_jugador: [null, [Validators.required]],
    });
  }

  private loadPagoData(pago: IPago): void {
    const cuotaId = pago.cuota?.id ?? null;
    const jugadorId = pago.jugador?.id ?? null;

    this.pagoForm.patchValue({
      id: pago.id ?? 0,
      abonado: !!pago.abonado,
      fecha: pago.fecha ? pago.fecha.substring(0, 10) : '',
      id_cuota: cuotaId,
      id_jugador: jugadorId,
    });

    if (cuotaId) {
      this.syncCuota(cuotaId);
    }
    if (jugadorId) {
      this.syncJugador(jugadorId);
    }
  }

  private syncCuota(idCuota: number | null): void {
    if (!idCuota) {
      this.selectedCuota.set(null);
      return;
    }

    this.oCuotaService.get(idCuota).subscribe({
      next: (cuota: ICuota) => {
        this.selectedCuota.set(cuota);
      },
      error: (err: HttpErrorResponse) => {
        this.selectedCuota.set(null);
        console.error('Error al sincronizar cuota:', err);
        this.snackBar.open('Error al cargar la cuota seleccionada', 'Cerrar', { duration: 3000 });
      },
    });
  }

  private syncJugador(idJugador: number | null): void {
    if (!idJugador) {
      this.selectedJugador.set(null);
      return;
    }

    this.oJugadorService.getById(idJugador).subscribe({
      next: (jugador: IJugador) => {
        this.selectedJugador.set(jugador);
      },
      error: (err: HttpErrorResponse) => {
        this.selectedJugador.set(null);
        console.error('Error al sincronizar jugador:', err);
        this.snackBar.open('Error al cargar el jugador seleccionado', 'Cerrar', { duration: 3000 });
      },
    });
  }

  openCuotaFinderModal(): void {
    const dialogRef = this.dialog.open(CuotaPlistAdminUnrouted, {
      height: '800px',
      width: '1100px',
      maxWidth: '95vw',
      panelClass: 'cuota-dialog',
      data: {
        title: 'Seleccionar cuota',
        message: 'Busque y seleccione la cuota para este pago',
      },
    });

    dialogRef.afterClosed().subscribe((cuota: ICuota | null) => {
      if (cuota && cuota.id) {
        this.pagoForm.patchValue({
          id_cuota: cuota.id,
        });
        this.syncCuota(cuota.id);
        this.snackBar.open(`Cuota seleccionada: ${cuota.descripcion}`, 'Cerrar', {
          duration: 3000,
        });
      }
    });
  }

  openJugadorFinderModal(): void {
    const dialogRef = this.dialog.open(JugadorPlistAdminUnrouted, {
      height: '800px',
      width: '1100px',
      maxWidth: '95vw',
      panelClass: 'jugador-dialog',
      data: {
        title: 'Seleccionar jugador',
        message: 'Busque y seleccione el jugador para este pago',
      },
    });

    dialogRef.afterClosed().subscribe((jugador: IJugador | null) => {
      if (jugador && jugador.id) {
        this.pagoForm.patchValue({
          id_jugador: jugador.id,
        });
        this.syncJugador(jugador.id);
        this.snackBar.open(
          `Jugador seleccionado: ${jugador.usuario?.nombre} ${jugador.usuario?.apellido1}`,
          'Cerrar',
          {
            duration: 3000,
          },
        );
      }
    });
  }

  get abonado() {
    return this.pagoForm.get('abonado');
  }

  get fecha() {
    return this.pagoForm.get('fecha');
  }

  get id_cuota() {
    return this.pagoForm.get('id_cuota');
  }

  get id_jugador() {
    return this.pagoForm.get('id_jugador');
  }

  onSubmit(): void {
    if (this.pagoForm.invalid) {
      Object.keys(this.pagoForm.controls).forEach((key) => {
        this.pagoForm.get(key)?.markAsTouched();
      });
      this.snackBar.open('Por favor, complete todos los campos correctamente', 'Cerrar', {
        duration: 4000,
      });
      return;
    }

    const selectedCuotaId = this.pagoForm.value.id_cuota;
    const selectedJugadorId = this.pagoForm.value.id_jugador;

    if (!selectedCuotaId) {
      this.snackBar.open('Debe seleccionar una cuota', 'Cerrar', {
        duration: 4000,
      });
      return;
    }

    if (!selectedJugadorId) {
      this.snackBar.open('Debe seleccionar un jugador', 'Cerrar', {
        duration: 4000,
      });
      return;
    }

    this.submitting.set(true);

    const fechaForm: string = this.pagoForm.value.fecha;
    const fechaLocalDateTime = fechaForm
      ? fechaForm.length > 10
        ? fechaForm.replace('T', ' ')
        : `${fechaForm} 00:00:00`
      : null;

    const pagoData: any = {
      abonado: this.pagoForm.value.abonado ? 1 : 0,
      fecha: fechaLocalDateTime,
      cuota: { id: Number(selectedCuotaId) },
      jugador: { id: Number(selectedJugadorId) },
    };

    if (this.mode === 'edit' && this.pago?.id) {
      pagoData.id = this.pago.id;
    }

    if (this.mode === 'edit') {
      this.saveUpdate(pagoData);
    } else {
      this.saveCreate(pagoData);
    }
  }

  private saveCreate(pagoData: any): void {
    this.oPagoService.create(pagoData).subscribe({
      next: (id: number) => {
        this.snackBar.open('Pago creado exitosamente', 'Cerrar', { duration: 4000 });
        this.submitting.set(false);
        this.formSuccess.emit();
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error creando el pago');
        this.snackBar.open('Error creando el pago', 'Cerrar', { duration: 4000 });
        console.error(err);
        this.submitting.set(false);
      },
    });
  }

  private saveUpdate(pagoData: any): void {
    this.oPagoService.update(pagoData).subscribe({
      next: (id: number) => {
        this.snackBar.open('Pago actualizado exitosamente', 'Cerrar', { duration: 4000 });
        this.submitting.set(false);
        this.formSuccess.emit();
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error actualizando el pago');
        this.snackBar.open('Error actualizando el pago', 'Cerrar', { duration: 4000 });
        console.error(err);
        this.submitting.set(false);
      },
    });
  }

  onCancel(): void {
    this.formCancel.emit();
  }
}
