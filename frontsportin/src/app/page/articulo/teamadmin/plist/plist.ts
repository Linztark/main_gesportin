import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArticuloTeamadminPlist } from '../../../../component/articulo/teamadmin/plist/plist';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';
import { TipoarticuloService } from '../../../../service/tipoarticulo';

@Component({
  selector: 'app-articulo-teamadmin-plist-page',
  imports: [ArticuloTeamadminPlist, BreadcrumbComponent],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class ArticuloTeamadminPlistPage implements OnInit {
  breadcrumbItems = signal<BreadcrumbItem[]>([{ label: 'Tipos de Artículo', route: '/tipoarticulo/teamadmin' }, { label: 'Artículos' }]);

  id_tipoarticulo = signal<number | undefined>(undefined);

  private route = inject(ActivatedRoute);
  private tipoarticuloService = inject(TipoarticuloService);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id_tipoarticulo');
    if (idParam) {
      const id = Number(idParam);
      this.id_tipoarticulo.set(id);
      this.tipoarticuloService.get(id).subscribe({
        next: (t) => this.breadcrumbItems.set([
          { label: 'Tipos de Artículo', route: '/tipoarticulo/teamadmin' },
          { label: t.descripcion, route: `/tipoarticulo/teamadmin/view/${t.id}` },
          { label: 'Artículos' },
        ]),
        error: () => {},
      });
    }
  }
}
