import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HoldReservaRequest, ReservasService } from '../reservas/reservas.service';

type PaymentReservationData = {
  readonly userId: string;
  readonly habitacionId: string;
  readonly checkIn: string;
  readonly checkOut: string;
  readonly hotel: string;
  readonly personas: string;
};

type ReservationRow = {
  readonly label: string;
  readonly value: string;
};

@Component({
  selector: 'app-payment-page',
  templateUrl: './PaymentPage.component.html',
  styleUrl: './PaymentPage.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly reservasService = inject(ReservasService);

  private readonly missingReservationDataMessage =
    'No se puede hacer el pago porque faltan datos de la reserva.';
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
      { label: 'User ID', value: reservationData.userId },
      { label: 'Habitacion ID', value: reservationData.habitacionId },
      { label: 'Hotel', value: reservationData.hotel },
      { label: 'Numero de personas', value: reservationData.personas },
      { label: 'Check-in', value: reservationData.checkIn },
      { label: 'Check-out', value: reservationData.checkOut }
    ];
  });

  ngOnInit(): void {
    const reservationData = this.readReservationDataFromQueryParams();

    if (!reservationData) {
      this.holdReservationErrorMessage.set(this.missingReservationDataMessage);
      return;
    }

    this.reservationData.set(reservationData);
    this.submitHoldReservation();
  }

  submitHoldReservation(): void {
    const reservationData = this.reservationData();

    if (!reservationData) {
      this.holdReservationErrorMessage.set(this.missingReservationDataMessage);
      return;
    }

    const holdReservaPayload: HoldReservaRequest = {
      user_id: reservationData.userId,
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

    const userId = this.getRequiredQueryParam(queryParamMap.get('user_id'));
    const habitacionId = this.getRequiredQueryParam(queryParamMap.get('habitacion_id'));
    const checkIn = this.getRequiredQueryParam(queryParamMap.get('check_in'));
    const checkOut = this.getRequiredQueryParam(queryParamMap.get('check_out'));
    const hotel = this.getRequiredQueryParam(queryParamMap.get('hotel'));
    const personas = this.getRequiredQueryParam(queryParamMap.get('personas'));

    if (!userId || !habitacionId || !checkIn || !checkOut || !hotel || !personas) {
      return null;
    }

    return {
      userId,
      habitacionId,
      checkIn,
      checkOut,
      hotel,
      personas
    };
  }

  private getRequiredQueryParam(value: string | null): string | null {
    const trimmedValue = value?.trim();

    return trimmedValue ? trimmedValue : null;
  }
}
