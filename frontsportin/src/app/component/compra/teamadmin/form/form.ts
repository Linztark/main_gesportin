import { Component, OnInit, inject, signal, input } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ModalService } from '../../../shared/modal/modal.service';
import { CompraService } from '../../../../service/compra';
import { ArticuloService } from '../../../../service/articulo';
import { FacturaService } from '../../../../service/factura-service';
import { ICompra } from '../../../../model/compra';
import { IArticulo } from '../../../../model/articulo';
import { IFactura } from '../../../../model/factura';
import { SessionService } from '../../../../service/session';
import { ArticuloAdminPlist } from '../../../articulo/admin/plist/plist';
import { FacturaAdminPlist } from '../../../factura/admin/plist/plist';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../shared/breadcrumb/breadcrumb';

@Component({
  selector: 'app-compra-teamadmin-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BreadcrumbComponent],
  templateUrl: './form.html',
  styleUrl: './form.css',
})
export class CompraTeamadminForm implements OnInit {
  id = input<number>(0);
  returnUrl = input<string>('/compra/teamadmin');
  idArticulo = input<number>(0);

  private router = inject(Router);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private oCompraService = inject(CompraService);
  private oArticuloService = inject(ArticuloService);
  private oFacturaService = inject(FacturaService);
  private modalService = inject(ModalService);
  sessionService = inject(SessionService);

  compraForm!: FormGroup;
  error = signal<string | null>(null);
  loading = signal<boolean>(false);
  submitting = signal(false);
  selectedArticulo = signal<IArticulo | null>(null);
  selectedFactura = signal<IFactura | null>(null);
  breadcrumbItems = signal<BreadcrumbItem[]>([
    { label: 'Mis Clubes', route: '/club/teamadmin' },
    { label: 'Tipos de Artículos', route: '/tipoarticulo/teamadmin' },
    { label: 'Artículos', route: '/articulo/teamadmin' },
    { label: 'Compras', route: '/compra/teamadmin' },
    { label: 'Compra' },
  ]);

  ngOnInit(): void {
    this.initForm();

    if (this.id() > 0) {
      this.loadById(this.id());
    } else {
      if (this.idArticulo() > 0) {
        this.compraForm.patchValue({ id_articulo: this.idArticulo() });
        this.loadArticulo(this.idArticulo());
      }
      this.loading?.set(false);
    }
  }

  private initForm(): void {
    this.compraForm = this.fb.group({
      id: [{ value: 0, disabled: true }],
      cantidad: [0, [Validators.required, Validators.min(1)]],
      precio: [0, [Validators.required, Validators.min(0)]],
      id_articulo: [null, Validators.required],
      id_factura: [null, Validators.required],
    });
  }

  private loadById(id: number): void {
    this.loading.set(true);
    this.oCompraService.get(id).subscribe({
      next: (data: ICompra) => {
        this.loadCompraData(data);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando el registro');
        this.loading.set(false);
        console.error(err);
      },
    });
  }

  private loadCompraData(compra: ICompra): void {
    this.compraForm.patchValue({
      id: compra.id,
      cantidad: compra.cantidad,
      precio: compra.precio,
      id_articulo: compra.articulo?.id,
      id_factura: compra.factura?.id,
    });
    if (compra.articulo?.id) this.loadArticulo(compra.articulo.id);
    if (compra.factura?.id) this.loadFactura(compra.factura.id);
  }

  private loadArticulo(idArticulo: number): void {
    this.oArticuloService.get(idArticulo).subscribe({
      next: (articulo) => {
        this.selectedArticulo.set(articulo);
        const tipo = articulo.tipoarticulo;
        const isEdit = this.id() > 0;
        this.breadcrumbItems.set([
          { label: 'Mis Clubes', route: '/club/teamadmin' },
          { label: 'Tipos de Artículos', route: '/tipoarticulo/teamadmin' },
          ...(tipo ? [{ label: tipo.descripcion, route: `/tipoarticulo/teamadmin/view/${tipo.id}` }] : []),
          { label: 'Artículos', route: tipo ? `/articulo/teamadmin/tipoarticulo/${tipo.id}` : '/articulo/teamadmin' },
          { label: articulo.descripcion, route: `/articulo/teamadmin/view/${articulo.id}` },
          { label: 'Compras', route: `/compra/teamadmin/articulo/${articulo.id}` },
          ...(isEdit ? [{ label: `#${this.id()}`, route: `/compra/teamadmin/view/${this.id()}` }, { label: 'Editar' }] : [{ label: 'Nueva Compra' }]),
        ]);
      },
      error: () => this.selectedArticulo.set(null),
    });
  }

  private loadFactura(idFactura: number): void {
    this.oFacturaService.get(idFactura).subscribe({
      next: (factura) => this.selectedFactura.set(factura),
      error: () => this.selectedFactura.set(null),
    });
  }

  get cantidad() { return this.compraForm.get('cantidad'); }
  get precio() { return this.compraForm.get('precio'); }
  get id_articulo() { return this.compraForm.get('id_articulo'); }
  get id_factura() { return this.compraForm.get('id_factura'); }

  openArticuloFinderModal(): void {
    const ref = this.modalService.open<unknown, IArticulo | null>(ArticuloAdminPlist);
    ref.afterClosed$.subscribe((articulo: IArticulo | null) => {
      if (articulo?.id != null) {
        this.compraForm.patchValue({ id_articulo: articulo.id });
        this.selectedArticulo.set(articulo);
        this.snackBar.open(`Artículo seleccionado: ${articulo.descripcion}`, 'Cerrar', { duration: 3000 });
      }
    });
  }

  openFacturaFinderModal(): void {
    const ref = this.modalService.open<unknown, IFactura | null>(FacturaAdminPlist);
    ref.afterClosed$.subscribe((factura: IFactura | null) => {
      if (factura?.id != null) {
        this.compraForm.patchValue({ id_factura: factura.id });
        this.selectedFactura.set(factura);
        this.snackBar.open(`Factura seleccionada: #${factura.id}`, 'Cerrar', { duration: 3000 });
      }
    });
  }

  onSubmit(): void {
    if (this.compraForm.invalid) {
      this.snackBar.open('Por favor, complete todos los campos correctamente', 'Cerrar', { duration: 4000 });
      return;
    }

    this.submitting.set(true);

    const compraData: any = {
      cantidad: Number(this.compraForm.value.cantidad),
      precio: Number(this.compraForm.value.precio),
      articulo: { id: Number(this.compraForm.value.id_articulo) },
      factura: { id: Number(this.compraForm.value.id_factura) },
    };

    if (this.id() > 0) {
      compraData.id = this.id();
      this.oCompraService.update(compraData).subscribe({
        next: () => {
          this.snackBar.open('Compra actualizada exitosamente', 'Cerrar', { duration: 4000 });
          this.submitting.set(false);
          this.router.navigate([this.returnUrl()]);
        },
        error: (err: HttpErrorResponse) => {
          this.error.set('Error actualizando la compra');
          this.snackBar.open('Error actualizando la compra', 'Cerrar', { duration: 4000 });
          console.error(err);
          this.submitting.set(false);
        },
      });
    } else {
      this.oCompraService.create(compraData).subscribe({
        next: () => {
          this.snackBar.open('Compra creada exitosamente', 'Cerrar', { duration: 4000 });
          this.submitting.set(false);
          this.router.navigate([this.returnUrl()]);
        },
        error: (err: HttpErrorResponse) => {
          this.error.set('Error creando la compra');
          this.snackBar.open('Error creando la compra', 'Cerrar', { duration: 4000 });
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
