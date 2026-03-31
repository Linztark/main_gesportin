import { Component, signal, OnInit, inject, Input, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { DatetimePipe } from '../../../../pipe/datetime-pipe';
import { FacturaService } from '../../../../service/factura-service';
import { IFactura } from '../../../../model/factura';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../shared/breadcrumb/breadcrumb';

@Component({
  standalone: true,
  selector: 'app-factura-teamadmin-detail',
  imports: [CommonModule, RouterLink, DatetimePipe, BreadcrumbComponent],
  templateUrl: './detail.html',
  styleUrl: './detail.css',
})
export class FacturaTeamadminDetail implements OnInit {
  @Input() id: Signal<number> = signal(0);

  private facturaService = inject(FacturaService);

  oFactura = signal<IFactura | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  breadcrumbItems = signal<BreadcrumbItem[]>([
    { label: 'Mis Clubes', route: '/club/teamadmin' },
    { label: 'Usuarios', route: '/usuario/teamadmin' },
    { label: 'Facturas', route: '/factura/teamadmin' },
    { label: 'Factura' },
  ]);

  ngOnInit(): void {
    const idFactura = this.id();
    if (!idFactura || isNaN(idFactura)) {
      this.error.set('ID de factura no válido');
      this.loading.set(false);
      return;
    }
    this.load(idFactura);
  }

  private load(id: number): void {
    this.facturaService.get(id).subscribe({
      next: (data) => {
        this.oFactura.set(data);
        this.loading.set(false);
        const usuario = data.usuario;
        this.breadcrumbItems.set([
          { label: 'Mis Clubes', route: '/club/teamadmin' },
          { label: 'Usuarios', route: '/usuario/teamadmin' },
          ...(usuario ? [{ label: `${usuario.nombre} ${usuario.apellido1}`, route: `/usuario/teamadmin/view/${usuario.id}` }] : []),
          { label: 'Facturas', route: usuario ? `/factura/teamadmin/usuario/${usuario.id}` : '/factura/teamadmin' },
          { label: `#${data.id}` },
        ]);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando la factura');
        console.error(err);
        this.loading.set(false);
      },
    });
  }
}
