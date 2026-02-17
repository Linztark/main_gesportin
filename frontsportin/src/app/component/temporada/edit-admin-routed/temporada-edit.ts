import { Component, inject, OnInit, signal } from '@angular/core';
import { TemporadaFormAdminUnrouted } from '../form-admin-unrouted/temporada-form-unrouted';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-temporada-edit',
    imports: [TemporadaFormAdminUnrouted],
    templateUrl: './temporada-edit.html',
    styleUrl: './temporada-edit.css',
})
export class TemporadaEditAdminRouted implements OnInit {
        
id = signal<number>(0);
   private route = inject(ActivatedRoute);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.id.set(+idParam);
    }
  }
}
