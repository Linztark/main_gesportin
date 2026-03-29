import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CuotaTeamadminPlist } from '../../../../component/cuota/teamadmin/plist/plist';

@Component({
  selector: 'app-cuota-teamadmin-plist-page',
  imports: [CuotaTeamadminPlist],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class CuotaTeamadminPlistPage {
  id_equipo = signal<number | undefined>(undefined);

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id_equipo');
    if (idParam) {
      this.id_equipo.set(Number(idParam));
    }
  }
}
