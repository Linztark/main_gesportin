import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlistAdminUnrouted } from "../plist-admin-unrouted/tipousuario-plist";

@Component({
  selector: 'app-tipousuario-plist',
  imports: [CommonModule, PlistAdminUnrouted],
  templateUrl: './tipousuario-plist.html',
  styleUrl: './tipousuario-plist.css',
})
export class TipousuarioPlistAdminRouted {
  
}
