import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { TipoarticuloService } from '../../../../service/tipoarticulo';
import { NotificacionService } from '../../../../service/notificacion';;
import { TipoarticuloTeamadminDetail } from '../../../../component/tipoarticulo/teamadmin/detail/detail';
import { ConfirmacionBorradoComponent } from '../../../../component/shared/confirmacion-borrado/confirmacion-borrado.component';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';

@Component({
  selector: 'app-tipoarticulo-teamadmin-delete-page',
  imports: [TipoarticuloTeamadminDetail, ConfirmacionBorradoComponent, BreadcrumbComponent],
  templateUrl: './delete.html',
})
export class TipoarticuloTeamadminDeletePage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private tipoarticuloService = inject(TipoarticuloService);
  private notificacion = inject(NotificacionService);
  error = signal<string | null>(null);
  breadcrumbItems = signal<BreadcrumbItem[]>([
    { label: 'Mis Clubes', route: '/club/teamadmin' },
    { label: 'Tipos de Artículo', route: '/tipoarticulo/teamadmin' },
    { label: 'Eliminar Tipo' },
  ]);
  id_tipoarticulo = signal<number>(0);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const n = id ? Number(id) : NaN;
    this.id_tipoarticulo.set(n);
    if (!isNaN(n)) {
      this.tipoarticuloService.get(n).subscribe({
        next: (tipo) => {
          const items: BreadcrumbItem[] = [{ label: 'Mis Clubes', route: '/club/teamadmin' }];
          if (tipo.club) {
            items.push({ label: tipo.club.nombre, route: `/club/teamadmin/view/${tipo.club.id}` });
          }
          items.push({ label: 'Tipos de Artículo', route: '/tipoarticulo/teamadmin' });
          items.push({ label: tipo.descripcion, route: `/tipoarticulo/teamadmin/view/${tipo.id}` });
          items.push({ label: 'Eliminar Tipo' });
          this.breadcrumbItems.set(items);
        },
        error: () => { this.error.set('Error cargando el registro'); },
      });
    } else {
      this.error.set('ID no válido');
    }
  }

  doDelete(): void {
    this.tipoarticuloService.delete(this.id_tipoarticulo()).subscribe({
      next: () => {
        this.notificacion.info('Tipoarticulo eliminado/a');
        this.router.navigate(['/tipoarticulo/teamadmin']);
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
