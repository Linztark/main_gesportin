import { Component, OnInit, inject, signal, effect, input } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ModalService } from '../../../shared/modal/modal.service';
import { PartidoService } from '../../../../service/partido';
import { LigaService } from '../../../../service/liga';
import { IPartido } from '../../../../model/partido';
import { ILiga } from '../../../../model/liga';
import { SessionService } from '../../../../service/session';
import { LigaAdminPlist } from '../../../liga/admin/plist/plist';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../shared/breadcrumb/breadcrumb';

@Component({
  selector: 'app-partido-teamadmin-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BreadcrumbComponent],
  templateUrl: './form.html',
  styleUrl: './form.css',
})
export class PartidoTeamadminForm implements OnInit {
  id = input<number>(0);
  returnUrl = input<string>('/partido/teamadmin');
  idLiga = input<number>(0);

  private router = inject(Router);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private oPartidoService = inject(PartidoService);
  private oLigaService = inject(LigaService);
  private modalService = inject(ModalService);
  private sessionService = inject(SessionService);

  partidoForm!: FormGroup;
  error = signal<string | null>(null);
  loading = signal<boolean>(false);
  submitting = signal(false);
  selectedLiga = signal<ILiga | null>(null);
  breadcrumbItems = signal<BreadcrumbItem[]>([
    { label: 'Mis Clubes', route: '/club/teamadmin' },
    { label: 'Temporadas', route: '/temporada/teamadmin' },
    { label: 'Categorías', route: '/categoria/teamadmin' },
    { label: 'Equipos', route: '/equipo/teamadmin' },
    { label: 'Ligas', route: '/liga/teamadmin' },
    { label: 'Partidos', route: '/partido/teamadmin' },
    { label: 'Partido' },
  ]);

  ngOnInit(): void {
    this.initForm();

    if (this.id() > 0) {
      this.loadById(this.id());
    } else {
      if (this.idLiga() > 0) {
        this.partidoForm.patchValue({ id_liga: this.idLiga() });
        this.loadLiga(this.idLiga());
      }
      this.loading?.set(false);
    }
  }

  private initForm(): void {
    this.partidoForm = this.fb.group({
      id: [{ value: 0, disabled: true }],
      rival: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      id_liga: [null, Validators.required],
      local: [null, Validators.required],
      resultado: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(255)]],
    });
  }


  private loadById(id: number): void {
    this.loading.set(true);
    this.oPartidoService.get(id).subscribe({
      next: (data: IPartido) => {
        this.loadPartidoData(data);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando el registro');
        this.loading.set(false);
        console.error(err);
      },
    });
  }

  private loadPartidoData(partido: IPartido): void {
    this.partidoForm.patchValue({
      id: partido.id,
      rival: partido.rival,
      id_liga: partido.liga?.id,
      local: partido.local ? 1 : 0,
      resultado: partido.resultado,
    });
    if (partido.liga?.id) this.loadLiga(partido.liga.id);
  }

  private loadLiga(idLiga: number): void {
    this.oLigaService.get(idLiga).subscribe({
      next: (liga) => {
        this.selectedLiga.set(liga);
        const equipo = liga.equipo;
        const cat = equipo?.categoria;
        const temp = cat?.temporada;
        const isEdit = this.id() > 0;
        this.breadcrumbItems.set([
          { label: 'Mis Clubes', route: '/club/teamadmin' },
          { label: 'Temporadas', route: '/temporada/teamadmin' },
          ...(temp ? [{ label: temp.descripcion, route: `/temporada/teamadmin/view/${temp.id}` }] : []),
          { label: 'Categorías', route: temp ? `/categoria/teamadmin/temporada/${temp.id}` : '/categoria/teamadmin' },
          ...(cat ? [{ label: cat.nombre, route: `/categoria/teamadmin/view/${cat.id}` }] : []),
          { label: 'Equipos', route: cat ? `/equipo/teamadmin/categoria/${cat.id}` : '/equipo/teamadmin' },
          ...(equipo ? [{ label: equipo.nombre ?? '', route: `/equipo/teamadmin/view/${equipo.id}` }] : []),
          { label: 'Ligas', route: equipo ? `/liga/teamadmin/equipo/${equipo.id}` : '/liga/teamadmin' },
          { label: liga.nombre, route: `/liga/teamadmin/view/${liga.id}` },
          { label: 'Partidos', route: `/partido/teamadmin/liga/${liga.id}` },
          ...(isEdit ? [{ label: 'Editar Partido' }] : [{ label: 'Nuevo Partido' }]),
        ]);
      },
      error: () => this.selectedLiga.set(null),
    });
  }

  get rival() {
    return this.partidoForm.get('rival');
  }

  get id_liga() {
    return this.partidoForm.get('id_liga');
  }

  get local() {
    return this.partidoForm.get('local');
  }

  get resultado() {
    return this.partidoForm.get('resultado');
  }

  openLigaFinderModal(): void {
    const ref = this.modalService.open<unknown, ILiga | null>(LigaAdminPlist);
    ref.afterClosed$.subscribe((liga: ILiga | null) => {
      if (liga?.id != null) {
        this.partidoForm.patchValue({ id_liga: liga.id });
        this.selectedLiga.set(liga);
        this.snackBar.open(`Liga seleccionada: ${liga.nombre}`, 'Cerrar', { duration: 3000 });
      }
    });
  }

  onSubmit(): void {
    if (this.partidoForm.invalid) {
      this.snackBar.open('Por favor, complete todos los campos correctamente', 'Cerrar', { duration: 4000 });
      return;
    }

    this.submitting.set(true);

    const partidoData: any = {
      rival: this.partidoForm.value.rival,
      liga: { id: Number(this.partidoForm.value.id_liga) },
      local: Number(this.partidoForm.value.local) === 1,
      resultado: this.partidoForm.value.resultado,
    };

    if (this.id() > 0) {
      partidoData.id = this.id();
      this.oPartidoService.update(partidoData).subscribe({
        next: () => {
          this.snackBar.open('Partido actualizado exitosamente', 'Cerrar', { duration: 4000 });
          this.submitting.set(false);
          this.router.navigate([this.returnUrl()]);
        },
        error: (err: HttpErrorResponse) => {
          this.error.set('Error actualizando el partido');
          this.snackBar.open('Error actualizando el partido', 'Cerrar', { duration: 4000 });
          console.error(err);
          this.submitting.set(false);
        },
      });
    } else {
      this.oPartidoService.create(partidoData).subscribe({
        next: () => {
          this.snackBar.open('Partido creado exitosamente', 'Cerrar', { duration: 4000 });
          this.submitting.set(false);
          this.router.navigate([this.returnUrl()]);
        },
        error: (err: HttpErrorResponse) => {
          this.error.set('Error creando el partido');
          this.snackBar.open('Error creando el partido', 'Cerrar', { duration: 4000 });
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
