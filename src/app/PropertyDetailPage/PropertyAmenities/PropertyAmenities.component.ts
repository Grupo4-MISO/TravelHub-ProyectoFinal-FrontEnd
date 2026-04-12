import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { PropertyAmenity } from '../property-detail';

@Component({
  selector: 'app-property-amenities',
  templateUrl: './PropertyAmenities.component.html',
  styleUrls: ['./PropertyAmenities.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class PropertyAmenitiesComponent {
  @Input() amenities: PropertyAmenity[] = [];

  private readonly amenityMaterialIconMap: Record<string, string> = {
    IconWiFi: 'wifi',
    IconDesayuno: 'free_breakfast',
    IconEstacionamiento: 'local_parking',
    IconPiscina: 'pool',
    IconGimnasio: 'fitness_center',
    IconRoomService: 'room_service',
    IconSpa: 'spa',
    IconRestaurante: 'restaurant',
    IconPlayaPrivada: 'beach_access',
    IconBar: 'local_bar',
    IconTerraza: 'deck',
    IconTodoIncluido: 'all_inclusive',
    IconKidsClub: 'child_care',
    IconPlaya: 'beach_access',
    IconSnorkel: 'scuba_diving',
    IconBusinessCenter: 'business_center',
    IconChimenea: 'fireplace',
    IconJardin: 'yard',
    IconTourCafetero: 'emoji_nature',
    IconSenderismo: 'hiking'
  };

  getAmenityMaterialIcon(iconKey: string): string {
    return this.amenityMaterialIconMap[iconKey] ?? 'check_circle';
  }
}