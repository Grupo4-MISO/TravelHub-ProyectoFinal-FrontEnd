import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import { ReservasService, TarifaReservaResponse } from '../../reservas/reservas.service';

@Component({
  selector: 'app-payment-rate',
  templateUrl: './PaymentRate.component.html',
  styleUrl: './PaymentRate.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentRateComponent {
  private readonly reservasService = inject(ReservasService);

  readonly checkIn = input('');
  readonly checkOut = input('');
  readonly precio = input(0);
  readonly descuento = input(0.1);
  readonly pais = input('CO');

  readonly loading = signal(false);
  readonly errorMessage = signal('');
  readonly rate = signal<TarifaReservaResponse | null>(null);
  readonly totalNoches = computed<number>(() => {
    const checkIn = this.checkIn();
    const checkOut = this.checkOut();

    if (!checkIn || !checkOut) {
      return 0;
    }

    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      return 0;
    }

    const diffMs = endDate.getTime() - startDate.getTime();
    const msPerDay = 24 * 60 * 60 * 1000;
    return Math.max(0, Math.ceil(diffMs / msPerDay));
  });

  constructor() {
    effect(() => {
      const checkIn = this.checkIn();
      const checkOut = this.checkOut();
      const precio = this.precio();
      const descuento = this.descuento();
      const pais = this.pais();

      if (!checkIn || !checkOut || !pais || precio <= 0) {
        this.rate.set(null);
        this.errorMessage.set('No hay datos suficientes para calcular la tarifa.');
        return;
      }

      this.loading.set(true);
      this.errorMessage.set('');

      this.reservasService
        .calcularTarifaReserva({
          check_in: checkIn,
          check_out: checkOut,
          precio,
          descuento,
          pais
        })
        .subscribe({
          next: (rate) => {
            this.rate.set(rate);
            this.loading.set(false);
          },
          error: () => {
            this.rate.set(null);
            this.errorMessage.set('No se pudo calcular la tarifa de la reserva.');
            this.loading.set(false);
          }
        });
    });
  }
}
