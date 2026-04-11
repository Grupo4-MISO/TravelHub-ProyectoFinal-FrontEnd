import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

import { PaymentPageComponent } from './PaymentPage.component';
import { ReservasService } from '../reservas/reservas.service';

describe('PaymentPageComponent', () => {
  let component: PaymentPageComponent;
  let fixture: ComponentFixture<PaymentPageComponent>;
  let reservasServiceSpy: { holdReserva: ReturnType<typeof vi.fn> };
  let activatedRouteStub: { snapshot: { queryParamMap: ReturnType<typeof convertToParamMap> } };

  beforeEach(async () => {
    reservasServiceSpy = {
      holdReserva: vi.fn()
    };
    activatedRouteStub = {
      snapshot: {
        queryParamMap: convertToParamMap({
          user_id: 'user-123',
          habitacion_id: '550e8400-e29b-41d4-a716-446655440000',
          check_in: '2026-04-06',
          check_out: '2026-04-09',
          hotel: 'Hotel Central',
          personas: '2'
        })
      }
    };

    await TestBed.configureTestingModule({
      imports: [PaymentPageComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: ReservasService, useValue: reservasServiceSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentPageComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create the component and map query params into the summary', () => {
    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);
    reservasServiceSpy.holdReserva.mockReturnValue(of({}));

    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(reservasServiceSpy.holdReserva).toHaveBeenCalledWith({
      user_id: 'user-123',
      habitacion_id: '550e8400-e29b-41d4-a716-446655440000',
      check_in: '2026-04-06',
      check_out: '2026-04-09'
    });
    expect(component.reservationRows()).toEqual([
      { label: 'User ID', value: 'user-123' },
      { label: 'Habitacion ID', value: '550e8400-e29b-41d4-a716-446655440000' },
      { label: 'Hotel', value: 'Hotel Central' },
      { label: 'Numero de personas', value: '2' },
      { label: 'Check-in', value: '2026-04-06' },
      { label: 'Check-out', value: '2026-04-09' }
    ]);
    expect(component.holdReservationErrorMessage()).toBe('');
    expect(consoleLogSpy).toHaveBeenCalledWith('Reserva temporal creada correctamente desde pagos.');
  });

  it('should show an error when the reservation hold fails', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const error = new Error('hold failed');
    reservasServiceSpy.holdReserva.mockReturnValue(throwError(() => error));

    fixture.detectChanges();

    expect(reservasServiceSpy.holdReserva).toHaveBeenCalledTimes(1);
    expect(component.holdReservationErrorMessage()).toBe(
      'No se puede hacer el pago porque la habitacion no esta disponible.'
    );
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error al crear la reserva temporal desde pagos.', error);
  });
});
