import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { HoldReservaRequest, ReservasService } from '../../reservas/reservas.service';
import { PaymentReservationSummaryComponent } from '../PaymentReservationSummary/PaymentReservationSummary.component';
import { PaymentMethodComponent } from '../PaymentMethod/PaymentMethod.component';
import { PaymentRateComponent } from '../PaymentRate/PaymentRate.component';

type PaymentReservationData = {
  readonly checkIn: string;
  readonly checkOut: string;
  readonly habitacionId: string;
  readonly roomDescripcion: string;
  readonly propiedadId: string;
  readonly propertyNombre: string;
  readonly pais: string;
  readonly precio: string;
  readonly capacidad: string;
};

type ReservationRow = {
  readonly label: string;
  readonly value: string;
  readonly label2?: string;
  readonly value2?: string;
};

@Component({
  selector: 'app-payment',
  templateUrl: './Payment.component.html',
  styleUrl: './Payment.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PaymentReservationSummaryComponent, PaymentMethodComponent, PaymentRateComponent]
})
export class PaymentComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly reservasService = inject(ReservasService);

  private readonly missingReservationDataMessage =
    'No se puede hacer el pago porque faltan datos de la reserva.';
  private readonly missingSessionUserMessage =
    'No se puede hacer el pago porque no hay usuario en sesion (idUsuario).';
  private readonly holdReservationErrorMessageText =
    'No se puede hacer el pago porque la habitacion no esta disponible.';

  readonly holdReservationErrorMessage = signal('');
  readonly reservationData = signal<PaymentReservationData | null>(null);

  readonly reservationRows = computed<readonly ReservationRow[]>(() => {
    const reservationData = this.reservationData();

    if (!reservationData) {
      return [];
    }

    return [
      { label: 'Hospedaje', value: reservationData.propertyNombre },
      { label: 'Propiedad ID', value: reservationData.propiedadId },
      { label: 'Habitacion', value: reservationData.roomDescripcion },
      { label: 'Habitacion ID', value: reservationData.habitacionId },
      { label: 'Pais', value: reservationData.pais },
      { label: 'Numero de personas', value: reservationData.capacidad },
      {
        label: 'Check-in',
        value: reservationData.checkIn,
        label2: 'Check-out',
        value2: reservationData.checkOut
      },
      {
        label: 'Precio por noche',
        value: reservationData.precio,
        label2: 'Moneda',
        value2: localStorage.getItem('navbar_selected_currency') || 'COP'
      }
    ];
  });

  readonly precioNumerico = computed<number>(() => {
    const precio = this.reservationData()?.precio;
    const parsed = Number(precio);
    return Number.isFinite(parsed) ? parsed : 0;
  });

  ngOnInit(): void {
    const reservationDataFromQuery = this.readReservationDataFromQueryParams();

    if (!reservationDataFromQuery) {
      if (!this.holdReservationErrorMessage()) {
        this.holdReservationErrorMessage.set(this.missingReservationDataMessage);
      }
      return;
    }

    this.reservationData.set(reservationDataFromQuery);
    // Intentamos hacer el hold de la reserva al cargar 
    // la página de pagos para asegurar la disponibilidad de la habitación
    this.submitHoldReservation();
  }

  submitHoldReservation(): void {
    const reservationData = this.reservationData();

    if (!reservationData) {
      this.holdReservationErrorMessage.set(this.missingReservationDataMessage);
      return;
    }

    const userId = this.resolveCurrentUserId();
    if (!userId) {
      this.holdReservationErrorMessage.set(this.missingSessionUserMessage);
      this.router.navigate(['/login']);
      return;
    }

    const holdReservaPayload: HoldReservaRequest = {
      user_id: userId,
      habitacion_id: reservationData.habitacionId,
      check_in: reservationData.checkIn,
      check_out: reservationData.checkOut
    };

    this.reservasService.holdReserva(holdReservaPayload).subscribe({
      next: () => {
        this.holdReservationErrorMessage.set('');
        console.log('Reserva temporal creada correctamente desde pagos.');
      },
      error: (error) => {
        this.holdReservationErrorMessage.set(this.holdReservationErrorMessageText);
        console.error('Error al crear la reserva temporal desde pagos.', error);
      }
    });
  }

  private readReservationDataFromQueryParams(): PaymentReservationData | null {
    const queryParamMap = this.route.snapshot.queryParamMap;

    const habitacionId = this.getQueryParamWithFallback(queryParamMap, ['habitacionId']);
    const roomDescripcion = this.getQueryParamWithFallback(queryParamMap, ['roomDescripcion']);
    const propiedadId = this.getQueryParamWithFallback(queryParamMap, ['propiedadId', 'id']);
    const propertyNombre = this.getQueryParamWithFallback(queryParamMap, ['propertyNombre']);
    const pais = this.getQueryParamWithFallback(queryParamMap, ['pais', 'country_code']);
    const checkIn = this.getQueryParamWithFallback(queryParamMap, ['check_in', 'checkIn']);
    const checkOut = this.getQueryParamWithFallback(queryParamMap, ['check_out', 'checkOut']);
    const precio = this.getQueryParamWithFallback(queryParamMap, ['precio']);
    const capacidad = this.getQueryParamWithFallback(queryParamMap, ['capacidad']);

    const missingFields = this.getMissingFields({
      habitacionId,
      roomDescripcion,
      propiedadId,
      propertyNombre,
      pais,
      check_in: checkIn,
      check_out: checkOut,
      precio,
      capacidad
    });

    if (missingFields.length > 0) {
      this.holdReservationErrorMessage.set(
        `${this.missingReservationDataMessage} Faltan: ${missingFields.join(', ')}.`
      );
      return null;
    }

    return {
      habitacionId: habitacionId!,
      roomDescripcion: roomDescripcion!,
      propiedadId: propiedadId!,
      propertyNombre: propertyNombre!,
      pais: pais!,
      checkIn: checkIn!,
      checkOut: checkOut!,
      precio: precio!,
      capacidad: capacidad!
    };
  }

  private getRequiredQueryParam(value: string | null): string | null {
    const trimmedValue = value?.trim();

    return trimmedValue ? trimmedValue : null;
  }

  private resolveCurrentUserId(): string | null {
    return this.getRequiredQueryParam(sessionStorage.getItem('idUsuario'));
  }

  private getQueryParamWithFallback(queryParamMap: ParamMap, keys: string[]): string | null {
    for (const key of keys) {
      const value = this.getRequiredQueryParam(queryParamMap.get(key));
      if (value) {
        return value;
      }
    }

    return null;
  }

  private getMissingFields(fields: Record<string, string | null>): string[] {
    const missing: string[] = [];

    for (const [field, value] of Object.entries(fields)) {
      if (!value) {
        missing.push(field);
      }
    }

    return missing;
  }
}
