import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JugadorTeamadminPlist } from '../../../../component/jugador/teamadmin/plist/plist';

@Component({
  selector: 'app-jugador-teamadmin-plist-page',
  imports: [JugadorTeamadminPlist],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class JugadorTeamadminPlistPage {
  id_equipo = signal<number | undefined>(undefined);

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id_equipo');
    if (idParam) {
      this.id_equipo.set(Number(idParam));
    }
  }
}
