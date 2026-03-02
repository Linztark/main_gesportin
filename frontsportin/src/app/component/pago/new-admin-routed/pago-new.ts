import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PagoFormAdminUnrouted } from '../form-admin-unrouted/pago-form';

@Component({
  selector: 'app-pago-new-routed',
  standalone: true,
  imports: [CommonModule, PagoFormAdminUnrouted],
  templateUrl: './pago-new.html',
  styleUrl: './pago-new.css',
})
export class PagoNewAdminRouted {
  private router = inject(Router);

  onFormSuccess(): void {
    this.router.navigate(['/pago']);
  }

  onFormCancel(): void {
    this.router.navigate(['/pago']);
  }
}
