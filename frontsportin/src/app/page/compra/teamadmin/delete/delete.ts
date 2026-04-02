import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CompraService } from '../../../../service/compra';
import { NotificacionService } from '../../../../service/notificacion';;
import { CompraTeamadminDetail } from '../../../../component/compra/teamadmin/detail/detail';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';

@Component({
  selector: 'app-compra-teamadmin-delete-page',
  imports: [CompraTeamadminDetail, BreadcrumbComponent],
  templateUrl: './delete.html',
})
export class CompraTeamadminDeletePage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private compraService = inject(CompraService);
  private notificacion = inject(NotificacionService);
  error = signal<string | null>(null);
  breadcrumbItems = signal<BreadcrumbItem[]>([
    { label: 'Mis Clubes', route: '/club/teamadmin' },
    { label: 'Tipos de Artículo', route: '/tipoarticulo/teamadmin' },
    { label: 'Artículos', route: '/articulo/teamadmin' },
    { label: 'Compras', route: '/compra/teamadmin' },
    { label: 'Eliminar Compra' },
  ]);
  id_compra = signal<number>(0);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const n = id ? Number(id) : NaN;
    this.id_compra.set(n);
    if (!isNaN(n)) {
      this.compraService.get(n).subscribe({
        next: (compra) => {
          const art = compra.articulo;
          const tipo = art?.tipoarticulo;
          const items: BreadcrumbItem[] = [{ label: 'Mis Clubes', route: '/club/teamadmin' }];
          if (tipo?.club) {
            items.push({ label: tipo.club.nombre, route: `/club/teamadmin/view/${tipo.club.id}` });
          }
          items.push({ label: 'Tipos de Artículo', route: '/tipoarticulo/teamadmin' });
          if (tipo) {
            items.push({ label: tipo.descripcion, route: `/tipoarticulo/teamadmin/view/${tipo.id}` });
          }
          items.push({ label: 'Artículos', route: tipo ? `/articulo/teamadmin/tipoarticulo/${tipo.id}` : '/articulo/teamadmin' });
          if (art) {
            items.push({ label: art.descripcion, route: `/articulo/teamadmin/view/${art.id}` });
          }
          items.push({ label: 'Compras', route: art ? `/compra/teamadmin/articulo/${art.id}` : '/compra/teamadmin' });
          items.push({ label: 'Eliminar Compra' });
          this.breadcrumbItems.set(items);
        },
        error: () => { this.error.set('Error cargando el registro'); },
      });
    } else {
      this.error.set('ID no válido');
    }
  }

  doDelete(): void {
    this.compraService.delete(this.id_compra()).subscribe({
      next: () => {
        this.notificacion.info('Compra eliminada');
        this.router.navigate(['/compra/teamadmin']);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error eliminando el registro');
        this.notificacion.error('Error eliminando el registro');
        console.error(err);
      },
    });
  }

  doCancel(): void { window.history.back(); }
}
