import { Component } from '@angular/core';
import { AccessibilityService } from '../accessibility.service';

@Component({
  selector: 'app-accessibility-widget',
  templateUrl: './accessibility-widget.component.html',
  styleUrl: './accessibility-widget.component.css',
  standalone: false,
})
export class AccessibilityWidgetComponent {
  menuOpen = false;

  protected readonly fontSizeLabels = ['Normal', 'Mediano', 'Grande'];

  constructor(protected service: AccessibilityService) {}

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  cycleFontSize(): void {
    this.service.cycleFontSize();
  }
}
