import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoriaTeamadminPlist } from '../../../../component/categoria/teamadmin/plist/plist';

@Component({
  selector: 'app-categoria-teamadmin-plist-page',
  imports: [CategoriaTeamadminPlist],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class CategoriaTeamadminPlistPage {
  id_temporada = signal<number>(0);

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id_temporada');
    if (idParam) {
      this.id_temporada.set(Number(idParam));
    }
  }
}
