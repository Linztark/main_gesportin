import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CuotaPlistAdminUnrouted } from '../plist-admin-unrouted/cuota-plist-admin-unrouted';

@Component({
  selector: 'app-cuota-plist',
  imports: [CuotaPlistAdminUnrouted],
  templateUrl: './cuota-plist.html',
  styleUrls: ['./cuota-plist.css'],
  standalone: true,
})
export class CuotaPlistAdminRouted {
  equipo = signal<number>(0);

  constructor(private route: ActivatedRoute) {}
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id_equipo');
    if (id) {
      this.equipo.set(+id);
    }
  }
}
