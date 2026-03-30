import { Component, OnInit, Input, Output, EventEmitter, inject, signal, effect } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ModalService } from '../../../shared/modal/modal.service';
import { CarritoService } from '../../../../service/carrito';
import { ArticuloService } from '../../../../service/articulo';
import { UsuarioService } from '../../../../service/usuarioService';
import { ICarrito } from '../../../../model/carrito';
import { IArticulo } from '../../../../model/articulo';
import { IUsuario } from '../../../../model/usuario';
import { SessionService } from '../../../../service/session';
import { ArticuloAdminPlist } from '../../../articulo/admin/plist/plist';
import { UsuarioAdminPlist } from '../../../usuario/admin/plist/plist';

@Component({
  selector: 'app-carrito-admin-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form.html',
  styleUrl: './form.css',
})
export class CarritoAdminForm implements OnInit {
  @Input() carrito: ICarrito | null = null;
  @Input() isEditMode: boolean = false;
  @Output() formSuccess = new EventEmitter<void>();
  @Output() formCancel = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private oCarritoService = inject(CarritoService);
  private oArticuloService = inject(ArticuloService);
  private oUsuarioService = inject(UsuarioService);
  private modalService = inject(ModalService);
  private sessionService = inject(SessionService);

  carritoForm!: FormGroup;
  error = signal<string | null>(null);
  submitting = signal(false);
  selectedArticulo = signal<IArticulo | null>(null);
  selectedUsuario = signal<IUsuario | null>(null);

  constructor() {
    effect(() => {
      const c = this.carrito;
      if (c && this.carritoForm) {
        this.loadCarritoData(c);
      }
    });
  }

  ngOnInit(): void {
    this.initForm();

    if (this.carrito) {
      this.loadCarritoData(this.carrito);
    }
  }

  private initForm(): void {
    this.carritoForm = this.fb.group({
      id: [{ value: 0, disabled: true }],
      cantidad: [0, [Validators.required, Validators.min(1)]],
      id_articulo: [null, Validators.required],
      id_usuario: [null, Validators.required],
    });
  }

  private loadCarritoData(carrito: ICarrito): void {
    this.carritoForm.patchValue({
      id: carrito.id,
      cantidad: carrito.cantidad,
      id_articulo: carrito.articulo?.id,
      id_usuario: carrito.usuario?.id,
    });
    if (carrito.articulo?.id) this.loadArticulo(carrito.articulo.id);
    if (carrito.usuario?.id) this.loadUsuario(carrito.usuario.id);
  }

  private loadArticulo(idArticulo: number): void {
    this.oArticuloService.get(idArticulo).subscribe({
      next: (articulo) => this.selectedArticulo.set(articulo),
      error: () => this.selectedArticulo.set(null),
    });
  }

  private loadUsuario(idUsuario: number): void {
    this.oUsuarioService.get(idUsuario).subscribe({
      next: (usuario) => this.selectedUsuario.set(usuario),
      error: () => this.selectedUsuario.set(null),
    });
  }

  get cantidad() {
    return this.carritoForm.get('cantidad');
  }

  get id_articulo() {
    return this.carritoForm.get('id_articulo');
  }

  get id_usuario() {
    return this.carritoForm.get('id_usuario');
  }

  openArticuloFinderModal(): void {
    const ref = this.modalService.open<unknown, IArticulo | null>(ArticuloAdminPlist);
    ref.afterClosed$.subscribe((articulo: IArticulo | null) => {
      if (articulo?.id != null) {
        this.carritoForm.patchValue({ id_articulo: articulo.id });
        this.selectedArticulo.set(articulo);
        this.snackBar.open(`Artículo seleccionado: ${articulo.descripcion}`, 'Cerrar', { duration: 3000 });
      }
    });
  }

  openUsuarioFinderModal(): void {
    const ref = this.modalService.open<unknown, IUsuario | null>(UsuarioAdminPlist);
    ref.afterClosed$.subscribe((usuario: IUsuario | null) => {
      if (usuario?.id != null) {
        this.carritoForm.patchValue({ id_usuario: usuario.id });
        this.selectedUsuario.set(usuario);
        this.snackBar.open(`Usuario seleccionado: ${usuario.nombre} ${usuario.apellido1}`, 'Cerrar', { duration: 3000 });
      }
    });
  }

  onSubmit(): void {
    if (this.carritoForm.invalid) {
      this.snackBar.open('Por favor, complete todos los campos correctamente', 'Cerrar', { duration: 4000 });
      return;
    }

    this.submitting.set(true);

    const carritoData: any = {
      cantidad: Number(this.carritoForm.value.cantidad),
      articulo: { id: Number(this.carritoForm.value.id_articulo) },
      usuario: { id: Number(this.carritoForm.value.id_usuario) },
    };

    if (this.isEditMode && this.carrito?.id) {
      carritoData.id = this.carrito.id;
      this.oCarritoService.update(carritoData).subscribe({
        next: () => {
          this.snackBar.open('Carrito actualizado exitosamente', 'Cerrar', { duration: 4000 });
          this.submitting.set(false);
          this.formSuccess.emit();
        },
        error: (err: HttpErrorResponse) => {
          this.error.set('Error actualizando el carrito');
          this.snackBar.open('Error actualizando el carrito', 'Cerrar', { duration: 4000 });
          console.error(err);
          this.submitting.set(false);
        },
      });
    } else {
      this.oCarritoService.create(carritoData).subscribe({
        next: () => {
          this.snackBar.open('Carrito creado exitosamente', 'Cerrar', { duration: 4000 });
          this.submitting.set(false);
          this.formSuccess.emit();
        },
        error: (err: HttpErrorResponse) => {
          this.error.set('Error creando el carrito');
          this.snackBar.open('Error creando el carrito', 'Cerrar', { duration: 4000 });
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
