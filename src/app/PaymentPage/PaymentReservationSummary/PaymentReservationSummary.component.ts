import { ChangeDetectionStrategy, Component, input } from '@angular/core';

type ReservationRow = {
  readonly label: string;
  readonly value: string;
  readonly label2?: string;
  readonly value2?: string;
};

@Component({
  selector: 'app-payment-reservation-summary',
  templateUrl: './PaymentReservationSummary.component.html',
  styleUrl: './PaymentReservationSummary.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentReservationSummaryComponent {
  readonly reservationRows = input<readonly ReservationRow[]>([]);
}
