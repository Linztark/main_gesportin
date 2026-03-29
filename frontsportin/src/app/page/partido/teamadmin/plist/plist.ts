import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PartidoTeamadminPlist } from '../../../../component/partido/teamadmin/plist/plist';

@Component({
  selector: 'app-partido-teamadmin-plist-page',
  imports: [PartidoTeamadminPlist],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class PartidoTeamadminPlistPage {
  id_liga = signal<number | undefined>(undefined);

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id_liga');
    if (idParam) {
      this.id_liga.set(Number(idParam));
    }
  }
}
