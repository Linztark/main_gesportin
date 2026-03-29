import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NoticiaTeamadminPlist } from '../../../../component/noticia/teamadmin/plist/plist';

@Component({
  selector: 'app-noticia-teamadmin-plist-page',
  imports: [NoticiaTeamadminPlist],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class NoticiaPlistTeamadminPage {
  id_club = signal<number>(0);

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id_club');
    if (idParam) {
      this.id_club.set(Number(idParam));
    }
  }
}
