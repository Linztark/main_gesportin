import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CuotaFormAdminUnrouted } from '../form-unrouted/cuota-form';

@Component({
  selector: 'app-cuota-new-routed',
  standalone: true,
  imports: [CommonModule, CuotaFormAdminUnrouted],
  templateUrl: './cuota-new.html',
  styleUrl: './cuota-new.css',
})
export class CuotaNewAdminRouted {
  private router = inject(Router);

  onFormSuccess(): void {
    this.router.navigate(['/cuota']);
  }

  onFormCancel(): void {
    this.router.navigate(['/cuota']);
  }
}
