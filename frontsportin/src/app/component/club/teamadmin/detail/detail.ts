import { Component, inject, input, Input, OnInit, Signal, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { IClub } from '../../../../model/club';
import { DatetimePipe } from '../../../../pipe/datetime-pipe';
import { ClubService } from '../../../../service/club';
import { SessionService } from '../../../../service/session';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../shared/breadcrumb/breadcrumb';

@Component({
  selector: 'app-club-teamadmin-detail',
  imports: [DatetimePipe, RouterLink, BreadcrumbComponent],
  templateUrl: './detail.html',
  styleUrl: './detail.css',
})
export class ClubTeamadminDetail implements OnInit {
  @Input() id: Signal<number> = signal(0);

  private oClubService = inject(ClubService);
  session = inject(SessionService);
  //private snackBar = inject(MatSnackBar);

  oClub = signal<IClub | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  breadcrumbItems = signal<BreadcrumbItem[]>([
    { label: 'Mis Clubes', route: '/club/teamadmin' },
    { label: 'Club' },
  ]);

  ngOnInit(): void {  
    this.load(this.id());
  }

  load(id: number) {
    this.oClubService.get(id).subscribe({
      next: (data: IClub) => {
        this.oClub.set(data);
        this.loading.set(false);
        this.breadcrumbItems.set([
          { label: 'Mis Clubes', route: '/club/teamadmin' },
          { label: data.nombre },
        ]);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando el club');
        this.loading.set(false);
        //this.snackBar.open('Error cargando el club', 'Cerrar', { duration: 4000 });
        console.error(err);
      },
    });
  }
}
