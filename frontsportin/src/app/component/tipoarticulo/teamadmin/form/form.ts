import { Component, OnInit, inject, signal, effect, input } from '@angular/core';
import { Router } from '@angular/router';
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
import { BreadcrumbComponent, BreadcrumbItem } from '../../../shared/breadcrumb/breadcrumb';

@Component({
  selector: 'app-tipoarticulo-teamadmin-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BreadcrumbComponent],
  templateUrl: './form.html',
  styleUrl: './form.css',
})
export class TipoarticuloTeamadminForm implements OnInit {
  id = input<number>(0);
  returnUrl = input<string>('/tipoarticulo/teamadmin');

  private router = inject(Router);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private oTipoarticuloService = inject(TipoarticuloService);
  private oClubService = inject(ClubService);
  private modalService = inject(ModalService);
  sessionService = inject(SessionService);

  tipoarticuloForm!: FormGroup;
  error = signal<string | null>(null);
  loading = signal<boolean>(false);
  submitting = signal(false);
  selectedClub = signal<IClub | null>(null);
  breadcrumbItems = signal<BreadcrumbItem[]>([
    { label: 'Mis Clubes', route: '/club/teamadmin' },
    { label: 'Tipos de Artículos', route: '/tipoarticulo/teamadmin' },
    { label: 'Nuevo Tipo de Artículo' },
  ]);

  ngOnInit(): void {
    this.initForm();

    if (this.id() > 0) {
      this.loadById(this.id());
    } else {
      if (this.sessionService.isClubAdmin()) {
        const clubId = this.sessionService.getClubId();
        if (clubId != null) {
          this.tipoarticuloForm.patchValue({ id_club: clubId });
          this.loadClub(clubId);
        }
      }
      this.loading?.set(false);
    }
  }

  private initForm(): void {
    this.tipoarticuloForm = this.fb.group({
      id: [{ value: 0, disabled: true }],
      descripcion: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      id_club: [null, Validators.required],
    });
  }


  private loadById(id: number): void {
    this.loading.set(true);
    this.oTipoarticuloService.get(id).subscribe({
      next: (data: ITipoarticulo) => {
        this.loadTipoarticuloData(data);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando el registro');
        this.loading.set(false);
        console.error(err);
      },
    });
  }

  private loadTipoarticuloData(tipoarticulo: ITipoarticulo): void {
    this.tipoarticuloForm.patchValue({
      id: tipoarticulo.id,
      descripcion: tipoarticulo.descripcion,
      id_club: tipoarticulo.club?.id,
    });
    const club = tipoarticulo.club;
    this.breadcrumbItems.set([
      { label: 'Mis Clubes', route: '/club/teamadmin' },
      ...(club ? [{ label: club.nombre, route: `/club/teamadmin/view/${club.id}` }] : []),
      { label: 'Tipos de Artículos', route: club ? `/tipoarticulo/teamadmin/club/${club.id}` : '/tipoarticulo/teamadmin' },
      { label: tipoarticulo.descripcion, route: `/tipoarticulo/teamadmin/view/${tipoarticulo.id}` },
      { label: 'Editar' },
    ]);
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

    if (this.id() > 0) {
      tipoarticuloData.id = this.id();
      this.oTipoarticuloService.update(tipoarticuloData).subscribe({
        next: () => {
          this.snackBar.open('Tipo de artículo actualizado exitosamente', 'Cerrar', { duration: 4000 });
          this.submitting.set(false);
          this.router.navigate([this.returnUrl()]);
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
          this.router.navigate([this.returnUrl()]);
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
    this.router.navigate([this.returnUrl()]);
  }
}
