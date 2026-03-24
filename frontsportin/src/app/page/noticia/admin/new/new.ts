import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoticiaAdminForm } from '../../../../component/noticia/admin/form/form';

@Component({
  selector: 'app-noticia-admin-new-page',
  imports: [CommonModule, NoticiaAdminForm],
  templateUrl: './new.html',
  styleUrl: './new.css',
})
export class NoticiaAdminNewPage {
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  error = signal<string | null>(null);

  onFormSuccess(): void {
    this.router.navigate(['/noticia']);
  }

  onFormCancel(): void {
    this.router.navigate(['/noticia']);
  }
}
