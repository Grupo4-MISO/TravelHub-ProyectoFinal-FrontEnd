import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { HoldReservaRequest, ReservasService } from '../reservas/reservas.service';

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
  readonly holdReservationError = signal(false);
  readonly holdReservationErrorMessage =
    'No se puede hacer el pago porque la habitacion no esta disponible.';

  private readonly holdReservaPayload: HoldReservaRequest = {
    user_id: 'user-123',
    habitacion_id: '550e8400-e29b-41d4-a716-446655440000',
    check_in: '2026-04-06',
    check_out: '2026-04-09'
  };

  readonly reservationRows: readonly ReservationRow[] = [
    { label: 'Titular de la reserva', value: '{Nombre Titular}' },
    { label: 'Numero de personas', value: '{Numero Personas}' },
    { label: 'Hotel', value: '{Nombre Hotel}' },
    { label: 'Precio total', value: '{Precio Total}' },
    { label: 'Check-in', value: '{Fecha Checkin}' },
    { label: 'Check-out', value: '{Fecha Checkout}' }
  ];

  constructor(private reservasService: ReservasService) {}

  ngOnInit(): void {
    this.submitHoldReservation();
  }

  submitHoldReservation(): void {
    this.reservasService.holdReserva(this.holdReservaPayload).subscribe({
      next: () => {
        this.holdReservationError.set(false);
        console.log('Reserva temporal creada correctamente desde pagos.');
      },
      error: (error) => {
        this.holdReservationError.set(true);
        console.error('Error al crear la reserva temporal desde pagos.', error);
      }
    });
  }
}
