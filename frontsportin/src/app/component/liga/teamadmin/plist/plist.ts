import { Component, Input, OnChanges, signal, SimpleChanges } from '@angular/core';
import { LigaPlistTeamAdminUnrouted } from '../../plist-teamadmin-unrouted/liga-plist-teamadmin-unrouted';

@Component({
  standalone: true,
  selector: 'app-liga-teamadmin-plist',
  imports: [LigaPlistTeamAdminUnrouted],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class LigaTeamadminPlist implements OnChanges {
  @Input() id_equipo?: number;

  equipoSignal = signal<number>(0);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['id_equipo'] && this.id_equipo != null) {
      this.equipoSignal.set(this.id_equipo);
    }
  }
}
