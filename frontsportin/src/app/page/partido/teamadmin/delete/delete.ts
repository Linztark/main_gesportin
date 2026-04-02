import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { PartidoService } from '../../../../service/partido';
import { NotificacionService } from '../../../../service/notificacion';;
import { PartidoTeamadminDetail } from '../../../../component/partido/teamadmin/detail/detail';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';

@Component({
  selector: 'app-partido-teamadmin-delete-page',
  imports: [PartidoTeamadminDetail, BreadcrumbComponent],
  templateUrl: './delete.html',
})
export class PartidoTeamadminDeletePage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private partidoService = inject(PartidoService);
  private notificacion = inject(NotificacionService);
  error = signal<string | null>(null);
  breadcrumbItems = signal<BreadcrumbItem[]>([
    { label: 'Mis Clubes', route: '/club/teamadmin' },
    { label: 'Ligas', route: '/liga/teamadmin' },
    { label: 'Partidos', route: '/partido/teamadmin' },
    { label: 'Eliminar Partido' },
  ]);
  id_partido = signal<number>(0);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const n = id ? Number(id) : NaN;
    this.id_partido.set(n);
    if (!isNaN(n)) {
      this.partidoService.get(n).subscribe({
        next: (partido) => {
          const liga = partido.liga;
          const equipo = liga?.equipo;
          const cat = equipo?.categoria;
          const temp = cat?.temporada;
          const items: BreadcrumbItem[] = [{ label: 'Mis Clubes', route: '/club/teamadmin' }];
          if (temp?.club) {
            items.push({ label: temp.club.nombre, route: `/club/teamadmin/view/${temp.club.id}` });
          }
          items.push({ label: 'Temporadas', route: '/temporada/teamadmin' });
          if (temp) {
            items.push({ label: temp.descripcion, route: `/temporada/teamadmin/view/${temp.id}` });
          }
          if (cat) {
            items.push({ label: 'Categorías', route: temp ? `/categoria/teamadmin/temporada/${temp.id}` : '/categoria/teamadmin' });
            items.push({ label: cat.nombre!, route: `/categoria/teamadmin/view/${cat.id}` });
          } else {
            items.push({ label: 'Categorías', route: '/categoria/teamadmin' });
          }
          if (equipo) {
            items.push({ label: 'Equipos', route: cat ? `/equipo/teamadmin/categoria/${cat.id}` : '/equipo/teamadmin' });
            items.push({ label: equipo.nombre!, route: `/equipo/teamadmin/view/${equipo.id}` });
          } else {
            items.push({ label: 'Equipos', route: '/equipo/teamadmin' });
          }
          if (liga) {
            items.push({ label: 'Ligas', route: equipo ? `/liga/teamadmin/equipo/${equipo.id}` : '/liga/teamadmin' });
            items.push({ label: liga.nombre, route: `/liga/teamadmin/view/${liga.id}` });
          } else {
            items.push({ label: 'Ligas', route: '/liga/teamadmin' });
          }
          items.push({ label: 'Partidos', route: liga ? `/partido/teamadmin/liga/${liga.id}` : '/partido/teamadmin' });
          items.push({ label: partido.rival, route: `/partido/teamadmin/view/${partido.id}` });
          items.push({ label: 'Eliminar Partido' });
          this.breadcrumbItems.set(items);
        },
        error: () => { this.error.set('Error cargando el registro'); },
      });
    } else {
      this.error.set('ID no válido');
    }
  }

  doDelete(): void {
    this.partidoService.delete(this.id_partido()).subscribe({
      next: () => {
        this.notificacion.info('Partido eliminado/a');
        this.router.navigate(['/partido/teamadmin']);
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
