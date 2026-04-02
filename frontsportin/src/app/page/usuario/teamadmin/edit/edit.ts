import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsuarioTeamadminForm } from '../../../../component/usuario/teamadmin/form/form';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';
import { UsuarioService } from '../../../../service/usuarioService';

@Component({
  selector: 'app-usuario-teamadmin-edit-page',
  imports: [UsuarioTeamadminForm, BreadcrumbComponent],
  template: '<app-breadcrumb [items]=\"breadcrumbItems()\"></app-breadcrumb><app-usuario-teamadmin-form [id]="id_usuario()" [returnUrl]="returnUrl"></app-usuario-teamadmin-form>',
})
export class UsuarioTeamadminEditPage implements OnInit {
  breadcrumbItems = signal<BreadcrumbItem[]>([
    { label: 'Mis Clubes', route: '/club/teamadmin' },
    { label: 'Usuarios', route: '/usuario/teamadmin' },
    { label: 'Editar Usuario' },
  ]);

  private route = inject(ActivatedRoute);
  private usuarioService = inject(UsuarioService);
  id_usuario = signal<number>(0);
  returnUrl = '/usuario/teamadmin';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const n = id ? Number(id) : NaN;
    this.id_usuario.set(n);
    if (!isNaN(n)) {
      this.usuarioService.get(n).subscribe({
        next: (usuario) => {
          const items: BreadcrumbItem[] = [{ label: 'Mis Clubes', route: '/club/teamadmin' }];
          if (usuario.club) {
            items.push({ label: usuario.club.nombre, route: `/club/teamadmin/view/${usuario.club.id}` });
          }
          items.push({ label: 'Usuarios', route: '/usuario/teamadmin' });
          items.push({ label: `${usuario.nombre} ${usuario.apellido1}`, route: `/usuario/teamadmin/view/${usuario.id}` });
          items.push({ label: 'Editar Usuario' });
          this.breadcrumbItems.set(items);
        },
        error: () => {},
      });
    }
  }
}
