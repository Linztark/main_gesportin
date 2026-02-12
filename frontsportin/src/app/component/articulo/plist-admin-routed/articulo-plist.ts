import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArticuloPlistAdminUnrouted } from '../plist-admin-unrouted/articulo-plist-admin-unrouted';

@Component({
  selector: 'app-articulo-plist',
  imports: [ArticuloPlistAdminUnrouted],
  templateUrl: './articulo-plist.html',
  styleUrl: './articulo-plist.css',
})
export class ArticuloPlistAdminRouted {
  tipoarticulo = signal<number>(0);

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id_tipoarticulo');
    if (id) {
      this.tipoarticulo.set(+id);
    }
  }
}
