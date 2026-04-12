import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

import { PaymentComponent } from './Payment.component';
import { ReservasService } from '../../reservas/reservas.service';

describe('PaymentComponent', () => {
  let component: PaymentComponent;
  let fixture: ComponentFixture<PaymentComponent>;
  let router: Router;
  let reservasServiceSpy: {
    holdReserva: ReturnType<typeof vi.fn>;
    calcularTarifaReserva: ReturnType<typeof vi.fn>;
  };
  let activatedRouteStub: { snapshot: { queryParamMap: ReturnType<typeof convertToParamMap> } };

  beforeEach(async () => {
    reservasServiceSpy = {
      holdReserva: vi.fn(),
      calcularTarifaReserva: vi.fn().mockReturnValue(
        of({
          precio_base: 600000,
          descuento: 60000,
          impuestos: 102600,
          tarifa_total: 642600
        })
      )
    };
    activatedRouteStub = {
      snapshot: {
        queryParamMap: convertToParamMap({
          habitacionId: '550e8400-e29b-41d4-a716-446655440000',
          roomDescripcion: 'Suite Deluxe',
          propiedadId: 'hotel-888',
          propertyNombre: 'Hotel Central',
          pais: 'CO',
          check_in: '2026-04-06',
          check_out: '2026-04-09',
          precio: '150000',
          capacidad: '2'
        })
      }
    };

    sessionStorage.setItem('idUsuario', 'user-123');

    await TestBed.configureTestingModule({
      imports: [PaymentComponent],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: ReservasService, useValue: reservasServiceSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(PaymentComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    sessionStorage.removeItem('idUsuario');
  });

  it('should create the component and map query params into the summary', () => {
    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);
    reservasServiceSpy.holdReserva.mockReturnValue(of({}));

    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(reservasServiceSpy.calcularTarifaReserva).toHaveBeenCalled();
    expect(reservasServiceSpy.holdReserva).toHaveBeenCalledWith({
      user_id: 'user-123',
      habitacion_id: '550e8400-e29b-41d4-a716-446655440000',
      check_in: '2026-04-06',
      check_out: '2026-04-09'
    });
    expect(component.reservationRows()).toEqual([
      { label: 'Hospedaje', value: 'Hotel Central' },
      { label: 'Propiedad ID', value: 'hotel-888' },
      { label: 'Habitacion', value: 'Suite Deluxe' },
      { label: 'Habitacion ID', value: '550e8400-e29b-41d4-a716-446655440000' },
      { label: 'Pais', value: 'CO' },
      { label: 'Numero de personas', value: '2' },
      { label: 'Check-in', value: '2026-04-06', label2: 'Check-out', value2: '2026-04-09' },
      { label: 'Precio por noche', value: '150000', label2: 'Moneda', value2: 'COP' }
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

  it('redirects to login when idUsuario is missing', () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    reservasServiceSpy.holdReserva.mockReturnValue(of({}));
    sessionStorage.removeItem('idUsuario');

    fixture.detectChanges();

    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
    expect(component.holdReservationErrorMessage()).toContain('no hay usuario en sesion');
  });
});
