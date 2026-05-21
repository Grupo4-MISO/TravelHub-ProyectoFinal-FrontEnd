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
            // Prefer the tarifa's `valor_base` as the "sin descuento" price. If absent, try to reconstruct it
            // from `valor_final + valor_descuento_total`, otherwise fall back to the room's original price.
            const valorBase = Number(tarifaMatch.valor_base) || 0;
            const valorDescuento = Number(tarifaMatch.valor_descuento_total) || 0;
            const tarifaSinDescuento = valorBase > 0 ? valorBase : ((Number(tarifaMatch.valor_final) || 0) + valorDescuento) || room.precio;
            console.debug('PropertyRooms: tarifaMatch for room', { roomId: room.id, roomCategory, tarifaMatch: { id: tarifaMatch.id, nombre: tarifaMatch.nombre, moneda: tarifaMatch.moneda, valor_base: tarifaMatch.valor_base, valor_final: tarifaMatch.valor_final, valor_descuento_total: tarifaMatch.valor_descuento_total } });
            console.debug('PropertyRooms: computed', { valorBase, valorDescuento, tarifaSinDescuento, roomPrecioOriginal: room.precio });

            return {
              ...room,
              precio: Number(tarifaMatch.valor_final) || room.precio,
              precio_original: tarifaSinDescuento,
              tarifaAplicada: true,
              tarifaNombre: tarifaMatch.nombre,
              descuentoActivo: tieneDescuentoActivo
            };
          } else {
            // No matching tariff - show normal room price, converted if needed
            console.debug('PropertyRooms: no tarifaMatch for room', { roomId: room.id, roomCategory });
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

    // Calculate number of nights (at least 1)
    const toDate = (s: string) => s ? new Date(s) : null;
    const start = toDate(this.check_in);
    const end = toDate(this.check_out);
    let nights = 1;
    if (start && end) {
      const diffMs = end.getTime() - start.getTime();
      nights = diffMs > 0 ? Math.ceil(diffMs / (1000 * 60 * 60 * 24)) : 1;
    }

    const precioFinalPorNoche = Number(room.precio) || 0;
    const precioOriginalPorNoche = Number((room as any).precio_original) || precioFinalPorNoche;

    // descuento por noche = precioOriginal - precioFinal (siempre >= 0)
    const descuentoPorNoche = Math.max(0, precioOriginalPorNoche - precioFinalPorNoche);
    const descuentoTotal = descuentoPorNoche * nights;
    console.debug('PropertyRooms.reservar: computed reservation values', { roomId: room.id, check_in: this.check_in, check_out: this.check_out, nights, precioFinalPorNoche, precioOriginalPorNoche, descuentoPorNoche, descuentoTotal });

    this.router.navigate(['/payment'], {
      queryParams: {
        check_in: this.check_in,
        check_out: this.check_out,
        habitacionId: room.id,
        roomDescripcion: room.descripcion,
        propiedadId: this.propiedadId,
        propertyNombre: this.propertyNombre,
        pais: this.pais,
        // precio: tarifa por noche (lo que se paga por noche)
        precio: String(precioOriginalPorNoche),
        // descuento: total para la estadía
        descuento: String(descuentoTotal),
        capacidad: this.capacidad ?? room.capacidad
      }
    });
  }
}