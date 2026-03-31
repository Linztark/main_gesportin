import { Component, OnInit, inject, signal, effect, input } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ModalService } from '../../../shared/modal/modal.service';
import { CuotaService } from '../../../../service/cuota';
import { EquipoService } from '../../../../service/equipo';
import { ICuota } from '../../../../model/cuota';
import { IEquipo } from '../../../../model/equipo';
import { SessionService } from '../../../../service/session';
import { EquipoAdminPlist } from '../../../equipo/admin/plist/plist';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../shared/breadcrumb/breadcrumb';

@Component({
  selector: 'app-cuota-teamadmin-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BreadcrumbComponent],
  templateUrl: './form.html',
  styleUrl: './form.css',
})
export class CuotaTeamadminForm implements OnInit {
  id = input<number>(0);
  returnUrl = input<string>('/cuota/teamadmin');
  idEquipo = input<number>(0);

  private router = inject(Router);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private oCuotaService = inject(CuotaService);
  private oEquipoService = inject(EquipoService);
  private modalService = inject(ModalService);
  private sessionService = inject(SessionService);

  cuotaForm!: FormGroup;
  error = signal<string | null>(null);
  loading = signal<boolean>(false);
  submitting = signal(false);
  selectedEquipo = signal<IEquipo | null>(null);
  breadcrumbItems = signal<BreadcrumbItem[]>([
    { label: 'Mis Clubes', route: '/club/teamadmin' },
    { label: 'Temporadas', route: '/temporada/teamadmin' },
    { label: 'Categorías', route: '/categoria/teamadmin' },
    { label: 'Equipos', route: '/equipo/teamadmin' },
    { label: 'Cuotas', route: '/cuota/teamadmin' },
    { label: 'Cuota' },
  ]);

  ngOnInit(): void {
    this.initForm();

    if (this.id() > 0) {
      this.loadById(this.id());
    } else {
      if (this.idEquipo() > 0) {
        this.cuotaForm.patchValue({ id_equipo: this.idEquipo() });
        this.loadEquipo(this.idEquipo());
      }
      this.loading?.set(false);
    }
  }

  private initForm(): void {
    this.cuotaForm = this.fb.group({
      id: [{ value: 0, disabled: true }],
      descripcion: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      cantidad: [0, [Validators.required, Validators.min(0)]],
      fecha: ['', Validators.required],
      id_equipo: [null, Validators.required],
    });
  }


  private loadById(id: number): void {
    this.loading.set(true);
    this.oCuotaService.get(id).subscribe({
      next: (data: ICuota) => {
        this.loadCuotaData(data);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando el registro');
        this.loading.set(false);
        console.error(err);
      },
    });
  }

  private loadCuotaData(cuota: ICuota): void {
    this.cuotaForm.patchValue({
      id: cuota.id,
      descripcion: cuota.descripcion,
      cantidad: cuota.cantidad,
      fecha: cuota.fecha,
      id_equipo: cuota.equipo?.id,
    });
    if (cuota.equipo?.id) this.loadEquipo(cuota.equipo.id);
  }

  private loadEquipo(idEquipo: number): void {
    this.oEquipoService.get(idEquipo).subscribe({
      next: (equipo) => {
        this.selectedEquipo.set(equipo);
        const cat = equipo.categoria;
        const temp = cat?.temporada;
        const isEdit = this.id() > 0;
        const descripcion = this.cuotaForm.get('descripcion')?.value ?? '';
        this.breadcrumbItems.set([
          { label: 'Mis Clubes', route: '/club/teamadmin' },
          { label: 'Temporadas', route: '/temporada/teamadmin' },
          ...(temp ? [{ label: temp.descripcion, route: `/temporada/teamadmin/view/${temp.id}` }] : []),
          { label: 'Categorías', route: temp ? `/categoria/teamadmin/temporada/${temp.id}` : '/categoria/teamadmin' },
          ...(cat ? [{ label: cat.nombre, route: `/categoria/teamadmin/view/${cat.id}` }] : []),
          { label: 'Equipos', route: cat ? `/equipo/teamadmin/categoria/${cat.id}` : '/equipo/teamadmin' },
          { label: equipo.nombre ?? '', route: `/equipo/teamadmin/view/${equipo.id}` },
          { label: 'Cuotas', route: `/cuota/teamadmin/equipo/${equipo.id}` },
          ...(isEdit ? [{ label: descripcion || 'Cuota', route: `/cuota/teamadmin/view/${this.id()}` }, { label: 'Editar' }] : [{ label: 'Nueva Cuota' }]),
        ]);
      },
      error: () => this.selectedEquipo.set(null),
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

  openEquipoFinderModal(): void {
    const ref = this.modalService.open<unknown, IEquipo | null>(EquipoAdminPlist);
    ref.afterClosed$.subscribe((equipo: IEquipo | null) => {
      if (equipo?.id != null) {
        this.cuotaForm.patchValue({ id_equipo: equipo.id });
        this.selectedEquipo.set(equipo);
        this.snackBar.open(`Equipo seleccionado: ${equipo.nombre}`, 'Cerrar', { duration: 3000 });
      }
    });
  }

  onSubmit(): void {
    if (this.cuotaForm.invalid) {
      this.snackBar.open('Por favor, complete todos los campos correctamente', 'Cerrar', { duration: 4000 });
      return;
    }

    this.submitting.set(true);

    const cuotaData: any = {
      descripcion: this.cuotaForm.value.descripcion,
      cantidad: Number(this.cuotaForm.value.cantidad),
      fecha: this.cuotaForm.value.fecha,
      equipo: { id: Number(this.cuotaForm.value.id_equipo) },
    };

    if (this.id() > 0) {
      cuotaData.id = this.id();
      this.oCuotaService.update(cuotaData).subscribe({
        next: () => {
          this.snackBar.open('Cuota actualizada exitosamente', 'Cerrar', { duration: 4000 });
          this.submitting.set(false);
          this.router.navigate([this.returnUrl()]);
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
          this.router.navigate([this.returnUrl()]);
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
    this.router.navigate([this.returnUrl()]);
  }
}
