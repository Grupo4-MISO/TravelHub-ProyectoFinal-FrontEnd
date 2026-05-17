import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { PropertyRoom } from '../property-detail';
import { AuthService } from '../../auth/auth.service';
import { PropertyDetailService } from '../PropertyDetail.service';



@Component({
  selector: 'app-property-rooms',
  templateUrl: './PropertyRooms.component.html',
  styleUrls: ['./PropertyRooms.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class PropertyRoomsComponent implements OnChanges {

  @Input() rooms: PropertyRoom[] = [];
  @Input() hotelId: string = '';
  @Input() check_in: string = '';
  @Input() check_out: string = '';
  @Input() capacidad: number | null = null;
  @Input() propiedadId: string = '';
  @Input() propertyNombre: string = '';
  @Input() pais: string = 'CO';

  roomsWithPrices: PropertyRoom[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private propertyDetailService: PropertyDetailService
  ) {}

  ngOnChanges(): void {
    this.applyTariffsToRooms();
  }

  private applyTariffsToRooms(): void {
    // Show rooms immediately while we fetch tariffs
    this.roomsWithPrices = this.rooms ? [...this.rooms] : [];

    if (!this.rooms || this.rooms.length === 0) {
      return;
    }

    // Debug logs to help trace why rooms might not appear
    console.debug('PropertyRooms: applying tariffs for hotelId=', this.hotelId, 'rooms=', this.rooms);

    this.propertyDetailService.getPublicTarifas(this.hotelId).subscribe({
      next: (tarifas: any[]) => {
        console.debug('PropertyRooms: tarifas recibidas', tarifas);
        const localCurrency = this.localCurrency.toUpperCase().trim() || 'COP';
        this.roomsWithPrices = this.rooms.map(room => {
          const roomCategory = (room.categoria_habitacion || (room as any).categoria || '').toString().toUpperCase().trim();

          // Only match tariff if currency exactly matches
          const tarifaMatch = tarifas.find(tarifa => {
            const tarifaCategory = (tarifa.categoria_habitacion || '').toString().toUpperCase().trim();
            const tarifaCurrency = (tarifa.moneda || 'COP').toString().toUpperCase().trim();
            return tarifa.vigente && tarifaCategory === roomCategory && tarifaCurrency === localCurrency;
          });

          if (tarifaMatch) {
            // Tariff found with matching currency and category - apply it without conversion
            const tieneDescuentoActivo = Number(tarifaMatch.valor_descuento_total) > 0 || (tarifaMatch.descuentos_activos?.length || 0) > 0;
            return {
              ...room,
              precio: Number(tarifaMatch.valor_final) || room.precio,
              precio_original: room.precio,
              tarifaAplicada: true,
              tarifaNombre: tarifaMatch.nombre,
              descuentoActivo: tieneDescuentoActivo
            };
          } else {
            // No matching tariff - show normal room price, converted if needed
            return {
              ...room,
              precio: room.precio, // Keep original price (no tariff applied)
              tarifaAplicada: false,
              descuentoActivo: false
            };
          }
        });
      },
      error: (err) => {
        console.warn($localize`:@@tarifasPublicasError:No se pudieron cargar las tarifas públicas`, err);
        // keep initial rooms shown
      }
    });
  }

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