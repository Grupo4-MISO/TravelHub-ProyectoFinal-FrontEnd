import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, finalize, of, switchMap } from 'rxjs';
import { PaymentService } from '../Payment.service';
import { HoldReservaRequest, ReservasService } from '../../reservas/reservas.service';
import { environment } from '../../../environments/environment.development';

type PaymentProviderApi = {
  readonly id: string;
  readonly name: string;
  readonly is_active: boolean;
  readonly logo: string;
};

type PaymentProvider = {
  readonly id: string;
  readonly name: string;
  readonly logo: string;
};

type HoldReservaResponse = {
  readonly id?: string;
  readonly reserva_id?: string;
  readonly reservation_id?: string;
  readonly reserva?: {
    readonly id?: string;
  };
};

@Component({
  selector: 'app-payment-method',
  templateUrl: './PaymentMethod.component.html',
  styleUrl: './PaymentMethod.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentMethodComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly reservasService = inject(ReservasService);
  private readonly paymentService = inject(PaymentService);

    // Importamos URL del backend
    //private api_url = environment.apiUrl;
  
    // Para desarrollo local, usar la URL del inventarios
  private api_url = environment.trasacciones;

  private readonly providersEndpoint = `${this.api_url}/api/v1/Transactions/providers`;

  readonly habitacionId = input('');
  readonly roomDescripcion = input('');
  readonly propertyNombre = input('');
  readonly checkIn = input('');
  readonly checkOut = input('');
  readonly precio = input(0);
  readonly pais = input('CO');

  readonly paymentProviders = signal<readonly PaymentProvider[]>([]);
  readonly selectedProviderId = signal<string | null>(null);
  readonly isLoadingProviders = signal<boolean>(false);
  readonly isSubmittingPayment = signal<boolean>(false);
  readonly loadErrorMessage = signal('');
  readonly selectionErrorMessage = signal('');
  readonly submitErrorMessage = signal('');
  readonly submitStatusMessage = signal('');

  readonly hasProviders = computed(() => this.paymentProviders().length > 0);

  ngOnInit(): void {
    this.loadPaymentProviders();
  }

  onSelectProvider(providerId: string): void {
    this.selectedProviderId.set(providerId);
    this.selectionErrorMessage.set('');
  }

  onConfirmReservation(): void {
    if (!this.selectedProviderId()) {
      this.selectionErrorMessage.set('Selecciona un metodo de pago para continuar.');
      return;
    }

    const habitacionId = this.habitacionId().trim();
    const roomDescripcion = this.roomDescripcion().trim();
    const propertyNombre = this.propertyNombre().trim();
    const checkIn = this.checkIn().trim();
    const checkOut = this.checkOut().trim();
    const providerId = this.selectedProviderId();
    const amountBase = this.precio();
    const pais = this.pais().trim() || 'CO';
    const userId = sessionStorage.getItem('idUsuario')?.trim();

    if (!habitacionId || !roomDescripcion || !propertyNombre || !checkIn || !checkOut || !providerId) {
      this.submitErrorMessage.set('No hay informacion completa para registrar el pago.');
      return;
    }

    if (!userId) {
      this.submitErrorMessage.set('No hay usuario en sesion. Inicia sesion para continuar.');
      // this.router.navigate(['/login']);
      return;
    }

    if (!Number.isFinite(amountBase) || amountBase <= 0) {
      this.submitErrorMessage.set('El valor del pago es invalido.');
      return;
    }

    this.selectionErrorMessage.set('');
    this.submitErrorMessage.set('');
    this.submitStatusMessage.set('Generando transaccion de pago...');
    this.isSubmittingPayment.set(true);

    const holdReservaPayload: HoldReservaRequest = {
      user_id: userId,
      habitacion_id: habitacionId,
      check_in: checkIn,
      check_out: checkOut
    };

    this.reservasService
      .crearReserva(holdReservaPayload)
      .pipe(
        switchMap((holdResponse) => {
          const reservaId = this.extractReservaId(holdResponse as HoldReservaResponse);

          if (!reservaId) {
            throw new Error('No fue posible obtener el id de la reserva para crear el pago.');
          }

          return this.reservasService.calcularTarifaReserva({
            check_in: checkIn,
            check_out: checkOut,
            precio: amountBase,
            descuento: 0.1,
            pais
          }).pipe(
            switchMap((rateResponse) => {
              const currency = (localStorage.getItem('navbar_selected_currency') || 'COP').trim() || 'COP';

              return this.paymentService.createPayment({
                reserva_id: reservaId,
                provider_id: providerId,
                amount: rateResponse.tarifa_total,
                currency,
                status: 'pending',
                description: `Pago por reserva del hotel ${propertyNombre}`,
                provider_payment_id: null,
                url: null,
                metadata: {
                  habitacion_id: habitacionId,
                  habitacion: roomDescripcion,
                  check_in: checkIn,
                  check_out: checkOut
                }
              });
            })
          );
        }),
        finalize(() => {
          this.isSubmittingPayment.set(false);
        })
      )
      .subscribe({
        next: (paymentResponse) => {
          const providerPaymentId = paymentResponse.provider_payment_id?.trim();
          const paymentUrl = paymentResponse.url?.trim();

          if (!providerPaymentId || !paymentUrl) {
            this.submitErrorMessage.set(
              'El proveedor no devolvio la URL de pago. Intenta nuevamente.'
            );
            this.submitStatusMessage.set('');
            return;
          }

          this.submitStatusMessage.set('Cargando... te redirigiremos para completar el pago.');
          window.open(paymentUrl, '_blank', 'noopener,noreferrer');

          setTimeout(() => {
            this.router.navigate(['/']);
          }, 1200);
        },
        error: (error) => {
          console.error('Error al crear el pago.', error);
          this.submitStatusMessage.set('');
          this.submitErrorMessage.set('No se pudo generar la transaccion de pago. Intenta nuevamente.');
        }
      });
  }

  private extractReservaId(holdResponse: HoldReservaResponse): string | null {
    const reservaId =
      holdResponse.reserva_id ??
      holdResponse.reservation_id ??
      holdResponse.id ??
      holdResponse.reserva?.id ??
      null;

    return reservaId?.trim() || null;
  }

  private loadPaymentProviders(): void {
    this.isLoadingProviders.set(true);
    this.loadErrorMessage.set('');

    this.http
      .get<PaymentProviderApi[]>(this.providersEndpoint)
      .pipe(
        catchError((error) => {
          console.error('Error al consultar metodos de pago.', error);
          this.loadErrorMessage.set('No se pudieron cargar los metodos de pago. Intenta de nuevo.');
          return of([] as PaymentProviderApi[]);
        }),
        finalize(() => {
          this.isLoadingProviders.set(false);
        })
      )
      .subscribe((providers) => {
        const activeProviders = providers
          .filter((provider) => provider.is_active)
          .map((provider) => ({
            id: provider.id,
            name: provider.name,
            logo: provider.logo
          }));

        this.paymentProviders.set(activeProviders);

        if (activeProviders.length === 0) {
          this.selectedProviderId.set(null);

          if (!this.loadErrorMessage()) {
            this.loadErrorMessage.set('No hay metodos de pago disponibles en este momento.');
          }

          return;
        }

        const hasCurrentSelection = activeProviders.some(
          (provider) => provider.id === this.selectedProviderId()
        );

        if (!hasCurrentSelection) {
          this.selectedProviderId.set(activeProviders[0].id);
        }
      });
  }
}
