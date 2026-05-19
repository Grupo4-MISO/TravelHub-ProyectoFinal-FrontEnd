import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PropertyDetail } from './property-detail';
import { environment } from '../../environments/environment';

export interface Tarifa {
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
  descuentos_activos: any[];
  created_at: string;
  updated_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class PropertyDetailService {
  
  // Importamos URL del backend
  //private api_url = 'http://localhost:3000';
  private readonly api_url = environment.apiUrl;
  //private readonly tarifasUrl = `${environment.apiUrl}/tarifas`;
  private readonly tarifasUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getPropertyById(id: string, localCurrency?: string): Observable<PropertyDetail> {
    return this.http.get<PropertyDetail>(`${this.api_url}/api/v1/inventarios/hospedajes/${id}/${localCurrency}`);
  }

  getPublicTarifas(hotelId?: string): Observable<Tarifa[]> {
    let url = `${this.tarifasUrl}/api/v1/tarifas/publicas`;
    if (hotelId) {
      const q = `hotel_ids=${encodeURIComponent(hotelId)}`;
      url = `${url}?${q}`;
    }
    return this.http.get<Tarifa[]>(url);
  }
}