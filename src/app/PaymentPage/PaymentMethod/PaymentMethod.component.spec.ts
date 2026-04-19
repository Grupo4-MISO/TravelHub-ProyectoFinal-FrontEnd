import { HttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { PaymentMethodComponent } from './PaymentMethod.component';
import { PaymentService } from '../Payment.service';
import { ReservasService } from '../../reservas/reservas.service';

describe('PaymentMethodComponent', () => {
  let component: PaymentMethodComponent;
  let fixture: ComponentFixture<PaymentMethodComponent>;
  let httpClientSpy: { get: ReturnType<typeof vi.fn> };
  let reservasServiceSpy: {
    holdReserva: ReturnType<typeof vi.fn>;
    calcularTarifaReserva: ReturnType<typeof vi.fn>;
  };
  let paymentServiceSpy: {
    createPayment: ReturnType<typeof vi.fn>;
  };
  let routerSpy: {
    navigate: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    httpClientSpy = {
      get: vi.fn().mockReturnValue(
        of([
          {
            id: 'stripe-id',
            name: 'Stripe',
            is_active: true,
            logo: 'https://example.com/stripe.png'
          },
          {
            id: 'inactive-id',
            name: 'Inactive',
            is_active: false,
            logo: 'https://example.com/inactive.png'
          },
          {
            id: 'paypal-id',
            name: 'PayPal',
            is_active: true,
            logo: 'https://example.com/paypal.png'
          }
        ])
      )
    };

    reservasServiceSpy = {
      holdReserva: vi.fn(),
      calcularTarifaReserva: vi.fn()
    };

    paymentServiceSpy = {
      createPayment: vi.fn()
    };

    routerSpy = {
      navigate: vi.fn().mockResolvedValue(true)
    };

    await TestBed.configureTestingModule({
      imports: [PaymentMethodComponent],
      providers: [
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: ReservasService, useValue: reservasServiceSpy },
        { provide: PaymentService, useValue: paymentServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentMethodComponent);
    component = fixture.componentInstance;
    sessionStorage.setItem('idUsuario', 'user-123');
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
    sessionStorage.removeItem('idUsuario');
    localStorage.removeItem('navbar_selected_currency');
  });

  it('loads only active payment providers and selects the first one', () => {
    fixture.detectChanges();

    expect(httpClientSpy.get).toHaveBeenCalledWith(
      'http://127.0.0.1:3006/api/v1/Transactions/providers'
    );
    expect(component.paymentProviders()).toEqual([
      {
        id: 'stripe-id',
        name: 'Stripe',
        logo: 'https://example.com/stripe.png'
      },
      {
        id: 'paypal-id',
        name: 'PayPal',
        logo: 'https://example.com/paypal.png'
      }
    ]);
    expect(component.selectedProviderId()).toBe('stripe-id');
    expect(component.hasProviders()).toBe(true);
    expect(component.loadErrorMessage()).toBe('');
  });

  it('updates provider selection and clears selection error', () => {
    fixture.detectChanges();

    component.selectionErrorMessage.set('Selecciona un metodo de pago para continuar.');
    component.onSelectProvider('paypal-id');

    expect(component.selectedProviderId()).toBe('paypal-id');
    expect(component.selectionErrorMessage()).toBe('');
  });

  it('shows a validation message when confirming without a selected provider', () => {
    fixture.detectChanges();
    component.selectedProviderId.set(null);

    component.onConfirmReservation();

    expect(component.selectionErrorMessage()).toBe(
      'Selecciona un metodo de pago para continuar.'
    );
    expect(reservasServiceSpy.holdReserva).not.toHaveBeenCalled();
    expect(paymentServiceSpy.createPayment).not.toHaveBeenCalled();
  });

  it('creates the payment and redirects after receiving the provider url', () => {
    vi.useFakeTimers();

    reservasServiceSpy.holdReserva.mockReturnValue(of({ reserva_id: 'reserva-456' }));
    reservasServiceSpy.calcularTarifaReserva.mockReturnValue(
      of({
        precio_base: 180000,
        descuento: 18000,
        impuestos: 28800,
        tarifa_total: 350000
      })
    );
    paymentServiceSpy.createPayment.mockReturnValue(
      of({
        provider_payment_id: 'payment-789',
        url: 'https://payments.example/checkout'
      })
    );
    localStorage.setItem('navbar_selected_currency', 'COP');

    fixture.componentRef.setInput('habitacionId', '67fa2014-0cc9-4804-8a58-aea33beefb58');
    fixture.componentRef.setInput('roomDescripcion', 'Habitación Sencilla');
    fixture.componentRef.setInput('propertyNombre', 'Hotel Tequendama');
    fixture.componentRef.setInput('checkIn', '2029-07-24');
    fixture.componentRef.setInput('checkOut', '2029-08-01');
    fixture.componentRef.setInput('precio', 180000);
    fixture.componentRef.setInput('pais', 'CO');
    fixture.detectChanges();

    component.paymentProviders.set([
      {
        id: 'stripe-id',
        name: 'Stripe',
        logo: 'https://example.com/stripe.png'
      }
    ]);
    component.selectedProviderId.set('stripe-id');

    const windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

    component.onConfirmReservation();

    expect(reservasServiceSpy.holdReserva).toHaveBeenCalledWith({
      user_id: 'user-123',
      habitacion_id: '67fa2014-0cc9-4804-8a58-aea33beefb58',
      check_in: '2029-07-24',
      check_out: '2029-08-01'
    });
    expect(reservasServiceSpy.calcularTarifaReserva).toHaveBeenCalledWith({
      check_in: '2029-07-24',
      check_out: '2029-08-01',
      precio: 180000,
      descuento: 0.1,
      pais: 'CO'
    });
    expect(paymentServiceSpy.createPayment).toHaveBeenCalledWith({
      reserva_id: 'reserva-456',
      provider_id: 'stripe-id',
      amount: 350000,
      currency: 'COP',
      status: 'pending',
      description: 'Pago por reserva del hotel Hotel Tequendama',
      provider_payment_id: null,
      url: null,
      metadata: {
        habitacion_id: '67fa2014-0cc9-4804-8a58-aea33beefb58',
        habitacion: 'Habitación Sencilla',
        check_in: '2029-07-24',
        check_out: '2029-08-01'
      }
    });
    expect(component.submitStatusMessage()).toBe(
      'Cargando... te redirigiremos para completar el pago.'
    );
    expect(windowOpenSpy).toHaveBeenCalledWith(
      'https://payments.example/checkout',
      '_blank',
      'noopener,noreferrer'
    );

    vi.runAllTimers();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
    expect(component.isSubmittingPayment()).toBe(false);
  });
});