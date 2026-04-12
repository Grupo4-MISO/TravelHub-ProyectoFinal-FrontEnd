import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface HoldReservaRequest {
  user_id: string;
  habitacion_id: string;
  check_in: string;
  check_out: string;
}

export interface TarifaReservaRequest {
  check_in: string;
  check_out: string;
  precio: number;
  descuento: number;
  pais: string;
}

export interface TarifaReservaResponse {
  precio_base: number;
  descuento: number;
  impuestos: number;
  tarifa_total: number;
}

@Injectable({ providedIn: 'root' })
export class ReservasService {
  private readonly ApiUrl = `${environment.apiUrl}`;
  // private readonly ApiUrl = 'http://127.0.0.1:3001';

  constructor(private http: HttpClient) {}

  holdReserva(payload: HoldReservaRequest): Observable<unknown> {
    return this.http.post(`${this.ApiUrl}/api/v1/reservas/hold`, payload);
  }

  calcularTarifaReserva(payload: TarifaReservaRequest): Observable<TarifaReservaResponse> {
    return this.http.post<TarifaReservaResponse>(`${this.ApiUrl}/api/v1/reservas/tarifa`, payload);
  }
}
