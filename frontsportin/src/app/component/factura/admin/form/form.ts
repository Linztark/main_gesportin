import { Component, OnInit, Input, Output, EventEmitter, inject, signal, effect } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ModalService } from '../../../shared/modal/modal.service';
import { FacturaService } from '../../../../service/factura-service';
import { UsuarioService } from '../../../../service/usuarioService';
import { UsuarioAdminPlist } from '../../../usuario/admin/plist/plist';
import { IFactura } from '../../../../model/factura';
import { IUsuario } from '../../../../model/usuario';
import { SessionService } from '../../../../service/session';

@Component({
  selector: 'app-factura-admin-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form.html',
  styleUrl: './form.css',
})
export class FacturaAdminForm implements OnInit {
  @Input() factura: IFactura | null = null;
  @Input() isEditMode: boolean = false;
  @Output() formSuccess = new EventEmitter<void>();
  @Output() formCancel = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private oFacturaService = inject(FacturaService);
  private oUsuarioService = inject(UsuarioService);
  private modalService = inject(ModalService);
  private sessionService = inject(SessionService);

  facturaForm!: FormGroup;
  error = signal<string | null>(null);
  submitting = signal(false);
  selectedUsuario = signal<IUsuario | null>(null);

  constructor() {
    effect(() => {
      const f = this.factura;
      if (f && this.facturaForm) {
        this.loadFacturaData(f);
      }
    });
  }

  ngOnInit(): void {
    this.initForm();

    if (this.factura) {
      this.loadFacturaData(this.factura);
    }
  }

  private initForm(): void {
    this.facturaForm = this.fb.group({
      id: [{ value: 0, disabled: true }],
      fecha: ['', Validators.required],
      id_usuario: [null, Validators.required],
    });
  }

  private loadFacturaData(factura: IFactura): void {
    this.facturaForm.patchValue({
      id: factura.id,
      fecha: factura.fecha,
      id_usuario: factura.usuario?.id,
    });
    if (factura.usuario?.id) {
      this.loadUsuario(factura.usuario.id);
    }
  }

  private loadUsuario(idUsuario: number): void {
    this.oUsuarioService.get(idUsuario).subscribe({
      next: (usuario) => this.selectedUsuario.set(usuario),
      error: () => this.selectedUsuario.set(null),
    });
  }

  openUsuarioFinderModal(): void {
    const ref = this.modalService.open<unknown, IUsuario | null>(UsuarioAdminPlist);
    ref.afterClosed$.subscribe((usuario: IUsuario | null) => {
      if (usuario?.id != null) {
        this.facturaForm.patchValue({ id_usuario: usuario.id });
        this.selectedUsuario.set(usuario);
        this.snackBar.open(`Usuario seleccionado: ${usuario.nombre} ${usuario.apellido1}`, 'Cerrar', { duration: 3000 });
      }
    });
  }

  get fecha() {
    return this.facturaForm.get('fecha');
  }

  get id_usuario() {
    return this.facturaForm.get('id_usuario');
  }

  onSubmit(): void {
    if (this.facturaForm.invalid) {
      this.snackBar.open('Por favor, complete todos los campos correctamente', 'Cerrar', { duration: 4000 });
      return;
    }

    this.submitting.set(true);

    const facturaData: any = {
      fecha: this.facturaForm.value.fecha,
      usuario: { id: Number(this.facturaForm.value.id_usuario) },
    };

    if (this.isEditMode && this.factura?.id) {
      facturaData.id = this.factura.id;
      this.oFacturaService.update(facturaData).subscribe({
        next: () => {
          this.snackBar.open('Factura actualizada exitosamente', 'Cerrar', { duration: 4000 });
          this.submitting.set(false);
          this.formSuccess.emit();
        },
        error: (err: HttpErrorResponse) => {
          this.error.set('Error actualizando la factura');
          this.snackBar.open('Error actualizando la factura', 'Cerrar', { duration: 4000 });
          console.error(err);
          this.submitting.set(false);
        },
      });
    } else {
      this.oFacturaService.create(facturaData).subscribe({
        next: () => {
          this.snackBar.open('Factura creada exitosamente', 'Cerrar', { duration: 4000 });
          this.submitting.set(false);
          this.formSuccess.emit();
        },
        error: (err: HttpErrorResponse) => {
          this.error.set('Error creando la factura');
          this.snackBar.open('Error creando la factura', 'Cerrar', { duration: 4000 });
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
