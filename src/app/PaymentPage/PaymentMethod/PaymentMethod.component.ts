import { ChangeDetectionStrategy, Component, output } from '@angular/core';

@Component({
  selector: 'app-payment-method',
  templateUrl: './PaymentMethod.component.html',
  styleUrl: './PaymentMethod.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentMethodComponent {
  readonly confirmReservation = output<void>();

  onConfirmReservation(): void {
    this.confirmReservation.emit();
  }
}
