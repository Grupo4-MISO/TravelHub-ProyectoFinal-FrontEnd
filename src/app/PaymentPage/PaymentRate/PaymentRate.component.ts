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
  readonly descuento = input(0);
  readonly pais = input('CO');

  readonly loading = signal(false);
  readonly errorMessage = signal('');
  readonly rate = signal<TarifaReservaResponse | null>(null);
  readonly descuentoFraccion = computed<number>(() => {
    const precio = this.precio();
    const descuento = this.descuento();
    const totalBase = precio * this.totalNoches();

    if (totalBase <= 0) {
      return 0;
    }

    const fraccion = descuento / totalBase;
    if (!Number.isFinite(fraccion)) {
      return 0;
    }

    return Math.min(1, Math.max(0, Number(fraccion.toFixed(4))));
  });
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
      const descuentoFraccion = this.descuentoFraccion();
      const pais = this.pais();

      console.debug('PaymentRate.effect: inputs', { checkIn, checkOut, precio, descuento, descuentoFraccion, pais, totalNoches: this.totalNoches() });

      if (!checkIn || !checkOut || !pais || precio <= 0) {
        this.rate.set(null);
        this.errorMessage.set($localize`:@@insufficientRateData:No hay datos suficientes para calcular la tarifa.`);
        return;
      }

      this.loading.set(true);
      this.errorMessage.set('');

      this.reservasService
        .calcularTarifaReserva({
          check_in: checkIn,
          check_out: checkOut,
          precio,
          descuento: descuentoFraccion,
          pais
        })
        .subscribe({
          next: (rate) => {
            this.rate.set(rate);
            console.debug('PaymentRate: received rate', rate);
            this.loading.set(false);
          },
          error: () => {
            this.rate.set(null);
            this.errorMessage.set($localize`:@@rateCalculationFailed:No se pudo calcular la tarifa de la reserva.`);
            this.loading.set(false);
          }
        });
    });
  }
}
