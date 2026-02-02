import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { noticiaModel } from '../../../model/noticia';

@Component({
  selector: 'app-unrouted-noticia-view',
  imports: [CommonModule],
  templateUrl: './view-admin-unrouted.html',
  styleUrl: './view-admin-unrouted.css',
})
export class ViewAdminUnrouted {

  @Input() oNoticiaModel: noticiaModel | null = null;
}
