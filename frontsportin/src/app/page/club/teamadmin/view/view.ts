import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClubTeamadminDetail } from '../../../../component/club/teamadmin/detail/detail';

@Component({
  selector: 'app-club-teamadmin-view-page',
  imports: [ClubTeamadminDetail],
  template: '<div class="container"><app-club-teamadmin-detail [id]="id_club"></app-club-teamadmin-detail></div>',
})
export class ClubTeamadminViewPage implements OnInit {
  private route = inject(ActivatedRoute);
  id_club = signal<number>(0);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.id_club.set(id ? Number(id) : NaN);
  }
}
