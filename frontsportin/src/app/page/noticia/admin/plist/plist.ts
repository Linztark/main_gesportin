import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NoticiaAdminPlist } from '../../../../component/noticia/admin/plist/plist';

@Component({
  selector: 'app-noticia-admin-plist-page',
  imports: [NoticiaAdminPlist],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class NoticiaAdminPlistPage {
  id_club = signal<number>(0);

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id_club');
    if (idParam) {
      this.id_club.set(Number(idParam));
    }
  }
}
