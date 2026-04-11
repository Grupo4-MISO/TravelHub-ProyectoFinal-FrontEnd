import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { PaymentPageComponent } from './PaymentPage.component';
import { ReservasService } from '../reservas/reservas.service';

describe('PaymentPageComponent', () => {
  let component: PaymentPageComponent;
  let reservasServiceSpy: { holdReserva: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    reservasServiceSpy = {
      holdReserva: vi.fn()
    };
    component = new PaymentPageComponent(reservasServiceSpy as unknown as ReservasService);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should request a reservation hold with the configured payload', () => {
    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);
    reservasServiceSpy.holdReserva.mockReturnValue(of({}));

    component.submitHoldReservation();

    expect(reservasServiceSpy.holdReserva).toHaveBeenCalledWith({
      user_id: 'user-123',
      habitacion_id: '550e8400-e29b-41d4-a716-446655440000',
      check_in: '2026-04-06',
      check_out: '2026-04-09'
    });
    expect(reservasServiceSpy.holdReserva).toHaveBeenCalledTimes(1);
    expect(component.holdReservationError()).toBe(false);
    expect(consoleLogSpy).toHaveBeenCalledWith('Reserva temporal creada correctamente desde pagos.');
  });

  it('should log errors when the reservation hold fails', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const error = new Error('hold failed');
    reservasServiceSpy.holdReserva.mockReturnValue(throwError(() => error));

    component.submitHoldReservation();

    expect(reservasServiceSpy.holdReserva).toHaveBeenCalledTimes(1);
    expect(component.holdReservationError()).toBe(true);
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error al crear la reserva temporal desde pagos.', error);
  });
});
