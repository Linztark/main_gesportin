import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsuarioTeamadminPlist } from '../../../../component/usuario/teamadmin/plist/plist';

@Component({
  selector: 'app-usuario-teamadmin-plist-page',
  imports: [UsuarioTeamadminPlist],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class UsuarioTeamadminPlistPage {
  id_club = signal<number>(0);

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id_club');
    if (idParam) {
      this.id_club.set(Number(idParam));
    }
  }
}
