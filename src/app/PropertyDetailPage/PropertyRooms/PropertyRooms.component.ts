import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { PropertyRoom } from '../property-detail';

@Component({
  selector: 'app-property-rooms',
  templateUrl: './PropertyRooms.component.html',
  styleUrls: ['./PropertyRooms.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class PropertyRoomsComponent {
  @Input() rooms: PropertyRoom[] = [];
    get localCurrency(): string {
      return localStorage.getItem('navbar_selected_currency') || 'COP';
    }
}