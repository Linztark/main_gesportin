import { Component, signal, OnInit, inject, Input, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { DatetimePipe } from '../../../../pipe/datetime-pipe';
import { CompraService } from '../../../../service/compra';
import { ICompra } from '../../../../model/compra';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../shared/breadcrumb/breadcrumb';

@Component({
  standalone: true,
  selector: 'app-compra-teamadmin-detail',
  imports: [CommonModule, RouterLink, DatetimePipe, BreadcrumbComponent],
  templateUrl: './detail.html',
  styleUrl: './detail.css',
})
export class CompraTeamadminDetail implements OnInit {
  @Input() id: Signal<number> = signal(0);

  private compraService = inject(CompraService);

  oCompra = signal<ICompra | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  breadcrumbItems = signal<BreadcrumbItem[]>([
    { label: 'Mis Clubes', route: '/club/teamadmin' },
    { label: 'Tipos de Artículos', route: '/tipoarticulo/teamadmin' },
    { label: 'Artículos', route: '/articulo/teamadmin' },
    { label: 'Compras', route: '/compra/teamadmin' },
    { label: 'Compra' },
  ]);

  ngOnInit(): void {
    const idCompra = this.id();
    if (!idCompra || isNaN(idCompra)) {
      this.error.set('ID de compra no válido');
      this.loading.set(false);
      return;
    }
    this.load(idCompra);
  }

  private load(id: number): void {
    this.compraService.get(id).subscribe({
      next: (data) => {
        this.oCompra.set(data);
        this.loading.set(false);
        const art = data.articulo;
        const tipo = art?.tipoarticulo;
        this.breadcrumbItems.set([
          { label: 'Mis Clubes', route: '/club/teamadmin' },
          { label: 'Tipos de Artículos', route: '/tipoarticulo/teamadmin' },
          ...(tipo ? [{ label: tipo.descripcion, route: `/tipoarticulo/teamadmin/view/${tipo.id}` }] : []),
          { label: 'Artículos', route: tipo ? `/articulo/teamadmin/tipoarticulo/${tipo.id}` : '/articulo/teamadmin' },
          ...(art ? [{ label: art.descripcion, route: `/articulo/teamadmin/view/${art.id}` }] : []),
          { label: 'Compras', route: art ? `/compra/teamadmin/articulo/${art.id}` : '/compra/teamadmin' },
          { label: `#${data.id}` },
        ]);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando la compra');
        console.error(err);
        this.loading.set(false);
      },
    });
  }
}
