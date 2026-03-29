import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TemporadaTeamadminPlist } from '../../../../component/temporada/teamadmin/plist/plist';

@Component({
  selector: 'app-temporada-teamadmin-plist-page',
  imports: [TemporadaTeamadminPlist],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class TemporadaTeamadminPlistPage {
  id_club = signal<number>(0);

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id_club');
    if (idParam) {
      this.id_club.set(Number(idParam));
    }
  }
}
