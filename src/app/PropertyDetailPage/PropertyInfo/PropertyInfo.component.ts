import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { PropertyDetail } from '../property-detail';

@Component({
  selector: 'app-property-info',
  templateUrl: './PropertyInfo.component.html',
  styleUrls: ['./PropertyInfo.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class PropertyInfoComponent {
  @Input() property: PropertyDetail | null = null;

  getStarArray(rating: number): number[] {
    return Array(Math.floor(rating));
  }

  getEmptyStarArray(rating: number): number[] {
    return Array(5 - Math.floor(rating));
  }
}