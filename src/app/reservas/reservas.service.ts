import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface HoldReservaRequest {
  user_id: string;
  habitacion_id: string;
  check_in: string;
  check_out: string;
}

@Injectable({ providedIn: 'root' })
export class ReservasService {
  private readonly holdReservaUrl = 'http://localhost:8080/api/v1/reservas/hold';

  constructor(private http: HttpClient) {}

  holdReserva(payload: HoldReservaRequest): Observable<unknown> {
    return this.http.post(this.holdReservaUrl, payload);
  }
}
