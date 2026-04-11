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

@Injectable({ providedIn: 'root' })
export class ReservasService {
  private readonly holdReservaUrl = `${environment.apiUrl}/api/v1/reservas/hold`;

  constructor(private http: HttpClient) {}

  holdReserva(payload: HoldReservaRequest): Observable<unknown> {
    return this.http.post(this.holdReservaUrl, payload);
  }
}
