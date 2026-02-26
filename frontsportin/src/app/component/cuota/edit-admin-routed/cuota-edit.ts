import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CuotaService } from '../../../service/cuota';
import { ICuota } from '../../../model/cuota';
import { CuotaFormAdminUnrouted } from '../form-unrouted/cuota-form';

@Component({
  selector: 'app-cuota-edit-routed',
  imports: [CommonModule, CuotaFormAdminUnrouted],
  templateUrl: './cuota-edit.html',
  styleUrl: './cuota-edit.css',
})
export class CuotaEditAdminRouted implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cuotaService = inject(CuotaService);
  private snackBar = inject(MatSnackBar);

  id_cuota = signal<number>(0);
  loading = signal(true);
  error = signal<string | null>(null);
  cuota = signal<ICuota | null>(null);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (!idParam || idParam === '0') {
      this.error.set('ID de cuota no válido');
      this.loading.set(false);
      return;
    }

    const id = Number(idParam);
    if (isNaN(id)) {
      this.error.set('ID no válido');
      this.loading.set(false);
      return;
    }

    this.id_cuota.set(id);
    this.loadCuota();
  }

  private loadCuota(): void {
    this.cuotaService.get(this.id_cuota()).subscribe({
      next: (c: ICuota) => {
        this.cuota.set(c);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando la cuota');
        this.snackBar.open('Error cargando la cuota', 'Cerrar', { duration: 4000 });
        console.error(err);
        this.loading.set(false);
      },
    });
  }

  onFormSuccess(): void {
    this.router.navigate(['/cuota']);
  }

  onFormCancel(): void {
    this.router.navigate(['/cuota']);
  }
}
