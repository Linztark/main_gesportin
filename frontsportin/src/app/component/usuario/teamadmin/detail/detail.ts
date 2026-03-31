import { Component, signal, OnInit, inject, Input, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { DatetimePipe } from '../../../../pipe/datetime-pipe';
import { UsuarioService } from '../../../../service/usuarioService';
import { IUsuario } from '../../../../model/usuario';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../shared/breadcrumb/breadcrumb';

@Component({
  standalone: true,
  selector: 'app-usuario-teamadmin-detail',
  imports: [CommonModule, RouterLink, DatetimePipe, BreadcrumbComponent],
  templateUrl: './detail.html',
  styleUrl: './detail.css',
})
export class UsuarioTeamadminDetail implements OnInit {
  @Input() id: Signal<number> = signal(0);

  private usuarioService = inject(UsuarioService);

  oUsuario = signal<IUsuario | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  breadcrumbItems = signal<BreadcrumbItem[]>([
    { label: 'Mis Clubes', route: '/club/teamadmin' },
    { label: 'Usuarios', route: '/usuario/teamadmin' },
    { label: 'Usuario' },
  ]);

  ngOnInit(): void {
    const idUsuario = this.id();
    if (!idUsuario || isNaN(idUsuario)) {
      this.error.set('ID de usuario no válido');
      this.loading.set(false);
      return;
    }
    this.load(idUsuario);
  }

  private load(id: number): void {
    this.usuarioService.get(id).subscribe({
      next: (data) => {
        this.oUsuario.set(data);
        this.loading.set(false);
        const club = data.club;
        this.breadcrumbItems.set([
          { label: 'Mis Clubes', route: '/club/teamadmin' },
          ...(club ? [{ label: club.nombre, route: `/club/teamadmin/view/${club.id}` }] : []),
          { label: 'Usuarios', route: club ? `/usuario/teamadmin/club/${club.id}` : '/usuario/teamadmin' },
          { label: `${data.nombre} ${data.apellido1}` },
        ]);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando el usuario');
        console.error(err);
        this.loading.set(false);
      },
    });
  }
}
