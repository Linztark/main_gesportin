import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TipoarticuloTeamadminPlist } from '../../../../component/tipoarticulo/teamadmin/plist/plist';

@Component({
  selector: 'app-tipoarticulo-teamadmin-plist-page',
  imports: [TipoarticuloTeamadminPlist],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class TipoarticuloTeamadminPlistPage {
  id_club = signal<number>(0);

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id_club');
    if (idParam) {
      this.id_club.set(Number(idParam));
    }
  }
}
