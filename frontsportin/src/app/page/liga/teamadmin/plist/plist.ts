import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LigaTeamadminPlist } from '../../../../component/liga/teamadmin/plist/plist';

@Component({
  selector: 'app-liga-teamadmin-plist-page',
  imports: [LigaTeamadminPlist],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class LigaTeamadminPlistPage {
  id_equipo = signal<number | undefined>(undefined);

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id_equipo');
    if (idParam) {
      this.id_equipo.set(Number(idParam));
    }
  }
}
