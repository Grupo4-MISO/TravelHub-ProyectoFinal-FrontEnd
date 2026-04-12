import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PropertyImage } from '../property-detail';

@Component({
  selector: 'app-property-images',
  templateUrl: './PropertyImages.component.html',
  styleUrls: ['./PropertyImages.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class PropertyImagesComponent {
  @Input() images: PropertyImage[] = [];
  @Input() selectedImage: string = '';
  @Input() propertyName: string = '';
  @Output() imageSelected = new EventEmitter<string>();

  selectImage(url: string): void {
    this.imageSelected.emit(url);
  }
}