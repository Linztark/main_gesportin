import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IFactura } from '../../../model/factura';
import { IUsuario } from '../../../model/usuario';
import { FacturaService } from '../../../service/factura-service';
import { UsuarioService } from '../../../service/usuarioService';
// Paginacion and BotoneraRpp not needed in this routed edit component
import { FacturaFormAdminUnrouted } from '../form-unrouted/factura-form';

@Component({
  selector: 'app-factura-edit-routed',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FacturaFormAdminUnrouted],
  templateUrl: './factura-edit.html',
  styleUrl: './factura-edit.css',
})
export class FacturaEditAdminRouted implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private oFacturaService = inject(FacturaService);
  private oUsuarioService = inject(UsuarioService);
  private snackBar = inject(MatSnackBar);

  id_factura = signal<number>(0);
  loading = signal(true);
  error = signal<string | null>(null);
  factura = signal<IFactura | null>(null);

  @ViewChild('usuarioDialog') usuarioDialog?: TemplateRef<any>;

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (!idParam || idParam === '0') {
      this.error.set('ID de factura no válido');
      this.loading.set(false);
      return;
    }

    this.id_factura.set(Number(idParam));

    if (isNaN(this.id_factura())) {
      this.error.set('ID no válido');
      this.loading.set(false);
      return;
    }

    this.loadFactura();
  }

  private loadFactura(): void {
    this.oFacturaService.get(this.id_factura()).subscribe({
      next: (f: IFactura) => {
        this.factura.set(f);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando la factura');
        this.snackBar.open('Error cargando la factura', 'Cerrar', { duration: 4000 });
        console.error(err);
        this.loading.set(false);
      },
    });
  }

  onFormSuccess(): void {
    this.router.navigate(['/factura']);
  }

  onFormCancel(): void {
    this.router.navigate(['/factura']);
  }
}
