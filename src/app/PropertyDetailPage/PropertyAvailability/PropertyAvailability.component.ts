import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-property-availability',
  templateUrl: './PropertyAvailability.component.html',
  styleUrls: ['./PropertyAvailability.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class PropertyAvailabilityComponent {
  @Input() check_in: string = '';
  @Input() check_out: string = '';
  @Input() capacidad: number | null = null;

  formatDate(dateValue: string): string {
    if (!dateValue) {
      return 'No definida';
    }

    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) {
      return dateValue;
    }

    return date.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}
