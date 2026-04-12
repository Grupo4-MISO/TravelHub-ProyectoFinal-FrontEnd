import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-property-map',
  templateUrl: './PropertyMap.component.html',
  styleUrls: ['./PropertyMap.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class PropertyMapComponent {
  @Input() latitude = 0;
  @Input() longitude = 0;
  @Input() propertyName = '';

  constructor(private sanitizer: DomSanitizer) { }

  get mapUrl(): SafeResourceUrl | null {
    if (!this.latitude && !this.longitude) {
      return null;
    }

    const delta = 0.01;
    const left = this.longitude - delta;
    const right = this.longitude + delta;
    const top = this.latitude + delta;
    const bottom = this.latitude - delta;

    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.openstreetmap.org/export/embed.html?bbox=${left},${bottom},${right},${top}&layer=mapnik&marker=${this.latitude},${this.longitude}`
    );
  }

  get openMapUrl(): string {
    if (!this.latitude && !this.longitude) {
      return '';
    }

    return `https://www.openstreetmap.org/?mlat=${this.latitude}&mlon=${this.longitude}#map=15/${this.latitude}/${this.longitude}`;
  }
}