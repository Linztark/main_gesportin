import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NoticiaTeamadminPlist } from '../../../../component/noticia/teamadmin/plist/plist';

@Component({
  selector: 'app-noticia-teamadmin-plist-page',
  imports: [NoticiaTeamadminPlist],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class NoticiaPlistTeamadminPage {
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {}
}
