import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export type Descuento = {
  id: string;
  nombre: string;
  tarifa_id: string;
  porcentaje: number;
  valor_descuento_calculado: number;
  activo: boolean;
  vigencia_inicio: string;
  vigencia_fin: string;
  vigente: boolean;
  created_at: string;
  updated_at: string;
};

export type Tarifa = {
  id: string;
  nombre: string;
  hotel_id: string;
  identificador: string;
  descripcion: string;
  valor_base: number;
  moneda: string;
  categoria_habitacion: string;
  estado: string;
  vigencia_inicio: string;
  vigencia_fin: string;
  vigente: boolean;
  valor_descuento_total: number;
  valor_final: number;
  descuentos_activos: Descuento[];
  created_at: string;
  updated_at: string;
  descuentos?: Partial<Descuento>[];
};

@Injectable({ providedIn: 'root' })
export class TarifasService {
  private readonly http = inject(HttpClient);
  //private readonly tarifasEndpoint = `${environment.apiUrl}/tarifas`;
  private readonly tarifasEndpoint = 'http://localhost:3008/tarifas';
  private readonly descuentosEndpoint = 'http://localhost:3008/descuentos';

  getTarifas(): Observable<Tarifa[]> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<Tarifa[]>(`${this.tarifasEndpoint}?vigentes=true`, { headers });
  }

  getTarifa(id: string): Observable<Tarifa> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Tarifa>(`${this.tarifasEndpoint}/${id}`, { headers });
  }

  createTarifa(payload: Partial<Tarifa>): Observable<Tarifa> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<Tarifa>(this.tarifasEndpoint, payload, { headers });
  }

  updateTarifa(id: string, payload: Partial<Tarifa>): Observable<Tarifa> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<Tarifa>(`${this.tarifasEndpoint}/${id}`, payload, { headers });
  }

  createDescuento(payload: Partial<Descuento>): Observable<Descuento> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<Descuento>(this.descuentosEndpoint, payload, { headers });
  }
}
