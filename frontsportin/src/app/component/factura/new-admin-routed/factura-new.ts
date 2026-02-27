import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FacturaFormAdminUnrouted } from '../form-unrouted/factura-form';

@Component({
  selector: 'app-factura-new-routed',
  standalone: true,
  imports: [CommonModule, FacturaFormAdminUnrouted],
  templateUrl: './factura-new.html',
  styleUrls: ['./factura-new.css'],
})
export class FacturaNewAdminRouted {
  private router = inject(Router);

  onFormSuccess(): void {
    this.router.navigate(['/factura']);
  }

  onFormCancel(): void {
    this.router.navigate(['/factura']);
  }
}
