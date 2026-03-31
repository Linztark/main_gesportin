import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { TipoarticuloAdminPlist } from '../../../tipoarticulo/admin/plist/plist';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../shared/breadcrumb/breadcrumb';
import { ClubService } from '../../../../service/club';

@Component({
  standalone: true,
  selector: 'app-tipoarticulo-teamadmin-plist',
  imports: [TipoarticuloAdminPlist, BreadcrumbComponent],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class TipoarticuloTeamadminPlist implements OnInit {
  @Input() id_club?: number;

  breadcrumbItems = signal<BreadcrumbItem[]>([
    { label: 'Mis Clubes', route: '/club/teamadmin' },
    { label: 'Tipos de Artículos' },
  ]);

  private clubService = inject(ClubService);

  ngOnInit(): void {
    if (this.id_club) {
      this.clubService.get(this.id_club).subscribe({
        next: (club) => this.breadcrumbItems.set([
          { label: 'Mis Clubes', route: '/club/teamadmin' },
          { label: club.nombre, route: `/club/teamadmin/view/${club.id}` },
          { label: 'Tipos de Artículos' },
        ]),
      });
    }
  }
}
