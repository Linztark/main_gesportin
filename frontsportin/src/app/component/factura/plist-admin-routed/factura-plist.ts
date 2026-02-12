import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FacturaPlistAdminUnrouted } from '../plist-admin-unrouted/factura-plist';

@Component({
  selector: 'app-factura-plist',
  standalone: true,
  imports: [CommonModule, FacturaPlistAdminUnrouted],
  templateUrl: './factura-plist.html',
  styleUrls: ['./factura-plist.css'],
})
export class FacturaPlistAdminRouted {
  
}

