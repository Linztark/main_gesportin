import { Component, signal, OnInit, inject, Input, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { DatetimePipe } from '../../../../pipe/datetime-pipe';
import { CarritoService } from '../../../../service/carrito';
import { ICarrito } from '../../../../model/carrito';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../shared/breadcrumb/breadcrumb';

@Component({
  standalone: true,
  selector: 'app-carrito-teamadmin-detail',
  imports: [CommonModule, RouterLink, DatetimePipe, BreadcrumbComponent],
  templateUrl: './detail.html',
  styleUrl: './detail.css',
})
export class CarritoTeamadminDetail implements OnInit {
  @Input() id: Signal<number> = signal(0);

  private carritoService = inject(CarritoService);

  oCarrito = signal<ICarrito | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  breadcrumbItems = signal<BreadcrumbItem[]>([
    { label: 'Mis Clubes', route: '/club/teamadmin' },
    { label: 'Tipos de Artículos', route: '/tipoarticulo/teamadmin' },
    { label: 'Artículos', route: '/articulo/teamadmin' },
    { label: 'Carritos', route: '/carrito/teamadmin' },
    { label: 'Carrito' },
  ]);

  ngOnInit(): void {
    const idCarrito = this.id();
    if (!idCarrito || isNaN(idCarrito)) {
      this.error.set('ID de carrito no válido');
      this.loading.set(false);
      return;
    }
    this.load(idCarrito);
  }

  private load(id: number): void {
    this.carritoService.get(id).subscribe({
      next: (data) => {
        this.oCarrito.set(data);
        this.loading.set(false);
        const art = data.articulo;
        const tipo = art?.tipoarticulo;
        this.breadcrumbItems.set([
          { label: 'Mis Clubes', route: '/club/teamadmin' },
          { label: 'Tipos de Artículos', route: '/tipoarticulo/teamadmin' },
          ...(tipo ? [{ label: tipo.descripcion, route: `/tipoarticulo/teamadmin/view/${tipo.id}` }] : []),
          { label: 'Artículos', route: tipo ? `/articulo/teamadmin/tipoarticulo/${tipo.id}` : '/articulo/teamadmin' },
          ...(art ? [{ label: art.descripcion, route: `/articulo/teamadmin/view/${art.id}` }] : []),
          { label: 'Carritos', route: art ? `/carrito/teamadmin/articulo/${art.id}` : '/carrito/teamadmin' },
          { label: `#${data.id}` },
        ]);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando el carrito');
        console.error(err);
        this.loading.set(false);
      },
    });
  }
}
