import { Component, OnInit } from '@angular/core';
import { TemporadaFormAdminUnrouted } from '../form-admin-unrouted/temporada-form-unrouted';

@Component({
    selector: 'app-temporada-new',
    imports: [TemporadaFormAdminUnrouted],
    templateUrl: './temporada-new-routed.html',
    styleUrl: './temporada-new-routed.css',
})
export class TemporadaNewAdminRouted implements OnInit {
        
        ngOnInit(): void {
        }
}
