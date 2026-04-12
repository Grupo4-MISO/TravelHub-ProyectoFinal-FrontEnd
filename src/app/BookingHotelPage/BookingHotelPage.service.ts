import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookingHotelPageService {
  private inventarios_url = environment.inventariosUrl;
  private reservas_url = environment.reservasUrl;
  private apiUrl = environment.apiUrl;

constructor(private http: HttpClient) { }

  identificarHospedaje(nombre: string){
    let params = new HttpParams()
    .set('nombre', nombre);
    return this.http.get<any>(`${this.apiUrl}/api/v1/inventarios/hotel`, { params });
  }

  listarHabitaciones(hotelId: string){
    let params = new HttpParams()
    .set('id', hotelId.toString());
    return this.http.get<any>(`${this.apiUrl}/api/v1/inventarios/habitaciones`, { params });
  }

  obtenerReservas(listaHabitaciones: string[]){
    const body = {
      habitaciones: listaHabitaciones
    };
    return this.http.post<any>(`${this.apiUrl}/api/v1/reservas`, body);
  }
}
