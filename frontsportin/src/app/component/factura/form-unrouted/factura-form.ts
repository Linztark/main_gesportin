import { Component, Input, Output, EventEmitter, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { FacturaService } from '../../../service/factura-service';
import { UsuarioService } from '../../../service/usuarioService';
import { IFactura } from '../../../model/factura';
import { IUsuario } from '../../../model/usuario';
import { UsuarioPlistAdminUnrouted } from '../../usuario/plist-admin-unrouted/usuario-plist-admin-unrouted';

@Component({
  selector: 'app-factura-form-unrouted',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './factura-form.html',
  styleUrls: ['./factura-form.css'],
})
export class FacturaFormAdminUnrouted implements OnInit {
  @Input() factura: IFactura | null = null;
  @Input() mode: 'create' | 'edit' = 'create';
  @Output() formSuccess = new EventEmitter<void>();
  @Output() formCancel = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  private oFacturaService = inject(FacturaService);
  private oUsuarioService = inject(UsuarioService);

  facturaForm!: FormGroup;
  submitting = signal(false);
  usuarios = signal<IUsuario[]>([]);
  selectedUsuario = signal<IUsuario | null>(null);
  displayIdUsuario = signal<number | null>(null);

  ngOnInit(): void {
    this.initForm();
    this.loadUsuarios();
    if (this.factura) {
      this.loadFacturaData(this.factura);
    }
  }

  private initForm(): void {
    this.facturaForm = this.fb.group({
      id: [{ value: 0, disabled: true }],
      fecha: ['', [Validators.required]],
      id_usuario: [null, Validators.required],
    });

    this.facturaForm.get('id_usuario')?.valueChanges.subscribe((id) => {
      if (id) {
        this.syncUsuario(Number(id));
      } else {
        this.selectedUsuario.set(null);
        this.displayIdUsuario.set(null);
      }
    });
  }

  private loadFacturaData(f: IFactura): void {
    this.facturaForm.patchValue({
      id: f.id ?? 0,
      fecha: f.fecha ? f.fecha.substring(0, 10) : '',
      id_usuario: f.usuario?.id ?? null,
    });
    if (f.usuario?.id) {
      this.syncUsuario(f.usuario.id);
    }
  }

  private loadUsuarios(): void {
    this.oUsuarioService.getPage(0, 1000, 'nombre', 'asc').subscribe({
      next: (page) => {
        this.usuarios.set(page.content);
        const idActual = this.facturaForm.get('id_usuario')?.value;
        if (idActual) {
          this.syncUsuario(Number(idActual));
        }
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Error cargando usuarios', 'Cerrar', { duration: 4000 });
      },
    });
  }

  private syncUsuario(idUsuario: number | null | undefined): void {
    if (!idUsuario) {
      this.selectedUsuario.set(null);
      this.displayIdUsuario.set(null);
      return;
    }
    const usuario = this.usuarios().find((u) => u.id === idUsuario) ?? null;
    this.selectedUsuario.set(usuario);
    this.displayIdUsuario.set(usuario?.id ?? null);
  }

  openUsuarioFinderModal(): void {
    const dialogRef = this.dialog.open(UsuarioPlistAdminUnrouted, {
      height: '800px',
      width: '1100px',
      maxWidth: '95vw',
      panelClass: 'usuario-dialog',
      data: { title: 'Elegir usuario', message: 'Plist finder' },
    });

    dialogRef.afterClosed().subscribe((usuario: IUsuario | null) => {
      if (usuario) {
        this.facturaForm.patchValue({ id_usuario: usuario.id });
        this.syncUsuario(usuario.id);
        this.snackBar.open(`Usuario seleccionado: ${usuario.nombre}`, 'Cerrar', { duration: 3000 });
      }
    });
  }

  onSubmit(): void {
    if (this.facturaForm.invalid) {
      this.facturaForm.markAllAsTouched();
      this.snackBar.open('Complete todos los campos correctamente', 'Cerrar', { duration: 3000 });
      return;
    }

    this.submitting.set(true);

    const fechaForm: string = this.facturaForm.value.fecha;
    const fechaLocalDateTime = fechaForm
      ? fechaForm.length > 10
        ? fechaForm.replace('T', ' ')
        : `${fechaForm} 00:00:00`
      : null;

    const payload: any = {
      fecha: fechaLocalDateTime,
      usuario: { id: this.facturaForm.value.id_usuario },
    };

    if (this.mode === 'edit' && this.factura?.id) {
      payload.id = this.factura.id;
      this.oFacturaService.update(payload).subscribe({
        next: () => {
          this.submitting.set(false);
          this.snackBar.open('Factura actualizada', 'Cerrar', { duration: 3000 });
          this.formSuccess.emit();
        },
        error: (err) => {
          console.error(err);
          this.submitting.set(false);
          this.snackBar.open('Error actualizando factura', 'Cerrar', { duration: 4000 });
        },
      });
    } else {
      this.oFacturaService.create(payload).subscribe({
        next: () => {
          this.submitting.set(false);
          this.snackBar.open('Factura creada', 'Cerrar', { duration: 3000 });
          this.formSuccess.emit();
        },
        error: (err) => {
          console.error(err);
          this.submitting.set(false);
          this.snackBar.open('Error creando factura', 'Cerrar', { duration: 4000 });
        },
      });
    }
  }

  onCancel(): void {
    this.formCancel.emit();
  }
}
