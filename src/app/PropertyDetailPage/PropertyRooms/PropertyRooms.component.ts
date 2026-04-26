import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { PropertyRoom } from '../property-detail';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-property-rooms',
  templateUrl: './PropertyRooms.component.html',
  styleUrls: ['./PropertyRooms.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class PropertyRoomsComponent {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  @Input() rooms: PropertyRoom[] = [];
  @Input() check_in: string = '';
  @Input() check_out: string = '';
  @Input() capacidad: number | null = null;
  @Input() propiedadId: string = '';
  @Input() propertyNombre: string = '';
  @Input() pais: string = 'CO';

  get localCurrency(): string {
    return localStorage.getItem('navbar_selected_currency') || 'COP';
  }

reservar(room: PropertyRoom): void {
    const userId = this.authService.resolveCurrentUserId();
    console.log('userId:', userId);
    if (!userId) {
      console.log('Redirecting to login...');
      this.router.navigate(['/login'], {
        queryParams: {
          redirect: 'property',
          id: this.propiedadId,
          check_in: this.check_in,
          check_out: this.check_out,
          capacidad: this.capacidad ?? room.capacidad
        }
      });
      return;
    }

    this.router.navigate(['/payment'], {
      queryParams: {
        check_in: this.check_in,
        check_out: this.check_out,
        habitacionId: room.id,
        roomDescripcion: room.descripcion,
        propiedadId: this.propiedadId,
        propertyNombre: this.propertyNombre,
        pais: this.pais,
        precio: room.precio,
        capacidad: this.capacidad ?? room.capacidad
      }
    });
  }
}