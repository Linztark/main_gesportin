import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClubTeamadminDetail } from '../../../../component/club/teamadmin/detail/detail';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';
import { ClubService } from '../../../../service/club';

@Component({
  selector: 'app-club-teamadmin-view-page',
  imports: [ClubTeamadminDetail, BreadcrumbComponent],
  template: '<app-breadcrumb [items]="breadcrumbItems()"></app-breadcrumb><div class="container-fluid"><app-club-teamadmin-detail [id]="id_club"></app-club-teamadmin-detail></div>',
})
export class ClubTeamadminViewPage implements OnInit {
  breadcrumbItems = signal<BreadcrumbItem[]>([
    { label: 'Mis Clubes', route: '/club/teamadmin' },
    { label: 'Club' },
  ]);

  private route = inject(ActivatedRoute);
  private clubService = inject(ClubService);
  id_club = signal<number>(0);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const n = id ? Number(id) : NaN;
    this.id_club.set(n);
    if (!isNaN(n)) {
      this.clubService.get(n).subscribe({
        next: (club) => {
          this.breadcrumbItems.set([
            { label: 'Mis Clubes', route: '/club/teamadmin' },
            { label: club.nombre },
          ]);
        },
        error: () => {},
      });
    }
  }
}
