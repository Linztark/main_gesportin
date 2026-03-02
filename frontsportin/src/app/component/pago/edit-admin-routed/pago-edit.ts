import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PagoService } from '../../../service/pago';
import { IPago } from '../../../model/pago';
import { PagoFormAdminUnrouted } from '../form-admin-unrouted/pago-form';

@Component({
  selector: 'app-pago-edit-admin-routed',
  standalone: true,
  imports: [CommonModule, PagoFormAdminUnrouted],
  templateUrl: './pago-edit.html',
  styleUrl: './pago-edit.css',
})
export class PagoEditAdminRouted implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private oPagoService = inject(PagoService);
  private snackBar = inject(MatSnackBar);

  pago = signal<IPago | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (!idParam || idParam === '0') {
      this.error.set('ID de pago no válido');
      this.loading.set(false);
      return;
    }

    const id = Number(idParam);

    if (isNaN(id)) {
      this.error.set('ID no válido');
      this.loading.set(false);
      return;
    }

    this.loadPago(id);
  }

  private loadPago(id: number): void {
    this.oPagoService.get(id).subscribe({
      next: (pago: IPago) => {
        this.pago.set(pago);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando el pago');
        this.snackBar.open('Error cargando el pago', 'Cerrar', { duration: 4000 });
        console.error(err);
        this.loading.set(false);
      },
    });
  }

  onFormSuccess(): void {
    this.router.navigate(['/pago']);
  }

  onFormCancel(): void {
    this.router.navigate(['/pago']);
  }
}
