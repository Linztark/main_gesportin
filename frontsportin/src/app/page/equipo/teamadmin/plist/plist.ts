import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EquipoTeamadminPlist } from '../../../../component/equipo/teamadmin/plist/plist';

@Component({
  selector: 'app-equipo-teamadmin-plist-page',
  imports: [EquipoTeamadminPlist],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class EquipoTeamadminPlistPage {
  id_categoria = signal<number>(0);

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id_categoria');
    if (idParam) {
      this.id_categoria.set(Number(idParam));
    }
  }
}
