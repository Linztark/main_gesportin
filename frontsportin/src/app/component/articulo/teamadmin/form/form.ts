import { Component, OnInit, inject, signal, effect, input } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ModalService } from '../../../shared/modal/modal.service';
import { ArticuloService } from '../../../../service/articulo';
import { TipoarticuloService } from '../../../../service/tipoarticulo';
import { IArticulo } from '../../../../model/articulo';
import { ITipoarticulo } from '../../../../model/tipoarticulo';
import { SessionService } from '../../../../service/session';
import { TipoarticuloAdminPlist } from '../../../tipoarticulo/admin/plist/plist';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../shared/breadcrumb/breadcrumb';

@Component({
  selector: 'app-articulo-teamadmin-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BreadcrumbComponent],
  templateUrl: './form.html',
  styleUrl: './form.css',
})
export class ArticuloTeamadminForm implements OnInit {
  id = input<number>(0);
  returnUrl = input<string>('/articulo/teamadmin');
  idTipoarticulo = input<number>(0);

  private router = inject(Router);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private oArticuloService = inject(ArticuloService);
  private oTipoarticuloService = inject(TipoarticuloService);
  private modalService = inject(ModalService);
  private sessionService = inject(SessionService);

  articuloForm!: FormGroup;
  error = signal<string | null>(null);
  loading = signal<boolean>(false);
  submitting = signal(false);
  selectedTipoarticulo = signal<ITipoarticulo | null>(null);
  breadcrumbItems = signal<BreadcrumbItem[]>([
    { label: 'Mis Clubes', route: '/club/teamadmin' },
    { label: 'Tipos de Artículos', route: '/tipoarticulo/teamadmin' },
    { label: 'Artículos', route: '/articulo/teamadmin' },
    { label: 'Nuevo Artículo' },
  ]);

  ngOnInit(): void {
    this.initForm();

    if (this.id() > 0) {
      this.loadById(this.id());
    } else {
      if (this.idTipoarticulo() > 0) {
        this.articuloForm.patchValue({ id_tipoarticulo: this.idTipoarticulo() });
        this.loadTipoarticulo(this.idTipoarticulo());
      }
      this.loading?.set(false);
    }
  }

  private initForm(): void {
    this.articuloForm = this.fb.group({
      id: [{ value: 0, disabled: true }],
      descripcion: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      precio: [0, [Validators.required, Validators.min(0)]],
      descuento: [0, [Validators.min(0), Validators.max(100)]],
      id_tipoarticulo: [null, Validators.required],
    });
  }


  private loadById(id: number): void {
    this.loading.set(true);
    this.oArticuloService.get(id).subscribe({
      next: (data: IArticulo) => {
        this.loadArticuloData(data);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando el registro');
        this.loading.set(false);
        console.error(err);
      },
    });
  }

  private loadArticuloData(articulo: IArticulo): void {
    this.articuloForm.patchValue({
      id: articulo.id,
      descripcion: articulo.descripcion,
      precio: articulo.precio,
      descuento: articulo.descuento,
      id_tipoarticulo: articulo.tipoarticulo?.id,
    });
    const tipo = articulo.tipoarticulo;
    this.breadcrumbItems.set([
      { label: 'Mis Clubes', route: '/club/teamadmin' },
      { label: 'Tipos de Artículos', route: '/tipoarticulo/teamadmin' },
      ...(tipo ? [{ label: tipo.descripcion, route: `/tipoarticulo/teamadmin/view/${tipo.id}` }] : []),
      { label: 'Artículos', route: tipo ? `/articulo/teamadmin/tipoarticulo/${tipo.id}` : '/articulo/teamadmin' },
      { label: articulo.descripcion, route: `/articulo/teamadmin/view/${articulo.id}` },
      { label: 'Editar' },
    ]);
    if (articulo.tipoarticulo?.id) this.loadTipoarticulo(articulo.tipoarticulo.id);
  }

  private loadTipoarticulo(idTipoarticulo: number): void {
    this.oTipoarticuloService.get(idTipoarticulo).subscribe({
      next: (tipoarticulo) => {
        this.selectedTipoarticulo.set(tipoarticulo);
        if (this.id() === 0) {
          this.breadcrumbItems.set([
            { label: 'Mis Clubes', route: '/club/teamadmin' },
            { label: 'Tipos de Artículos', route: '/tipoarticulo/teamadmin' },
            { label: tipoarticulo.descripcion, route: `/tipoarticulo/teamadmin/view/${tipoarticulo.id}` },
            { label: 'Artículos', route: `/articulo/teamadmin/tipoarticulo/${tipoarticulo.id}` },
            { label: 'Nuevo Artículo' },
          ]);
        }
      },
      error: () => this.selectedTipoarticulo.set(null),
    });
  }

  get descripcion() {
    return this.articuloForm.get('descripcion');
  }

  get precio() {
    return this.articuloForm.get('precio');
  }

  get descuento() {
    return this.articuloForm.get('descuento');
  }

  get id_tipoarticulo() {
    return this.articuloForm.get('id_tipoarticulo');
  }

  openTipoarticuloFinderModal(): void {
    const ref = this.modalService.open<unknown, ITipoarticulo | null>(TipoarticuloAdminPlist);
    ref.afterClosed$.subscribe((tipoarticulo: ITipoarticulo | null) => {
      if (tipoarticulo?.id != null) {
        this.articuloForm.patchValue({ id_tipoarticulo: tipoarticulo.id });
        this.selectedTipoarticulo.set(tipoarticulo);
        this.snackBar.open(`Tipo seleccionado: ${tipoarticulo.descripcion}`, 'Cerrar', { duration: 3000 });
      }
    });
  }

  onSubmit(): void {
    if (this.articuloForm.invalid) {
      this.snackBar.open('Por favor, complete todos los campos correctamente', 'Cerrar', { duration: 4000 });
      return;
    }

    this.submitting.set(true);

    const articuloData: any = {
      descripcion: this.articuloForm.value.descripcion,
      precio: Number(this.articuloForm.value.precio),
      descuento: Number(this.articuloForm.value.descuento),
      tipoarticulo: { id: Number(this.articuloForm.value.id_tipoarticulo) },
    };

    if (this.id() > 0) {
      articuloData.id = this.id();
      this.oArticuloService.update(articuloData).subscribe({
        next: () => {
          this.snackBar.open('Artículo actualizado exitosamente', 'Cerrar', { duration: 4000 });
          this.submitting.set(false);
          this.router.navigate([this.returnUrl()]);
        },
        error: (err: HttpErrorResponse) => {
          this.error.set('Error actualizando el artículo');
          this.snackBar.open('Error actualizando el artículo', 'Cerrar', { duration: 4000 });
          console.error(err);
          this.submitting.set(false);
        },
      });
    } else {
      this.oArticuloService.create(articuloData).subscribe({
        next: () => {
          this.snackBar.open('Artículo creado exitosamente', 'Cerrar', { duration: 4000 });
          this.submitting.set(false);
          this.router.navigate([this.returnUrl()]);
        },
        error: (err: HttpErrorResponse) => {
          this.error.set('Error creando el artículo');
          this.snackBar.open('Error creando el artículo', 'Cerrar', { duration: 4000 });
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
