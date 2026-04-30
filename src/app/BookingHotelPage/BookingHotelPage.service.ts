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
  private users_url = environment.authUrl;

constructor(private http: HttpClient) { }

  identificarHospedaje(nombre: string){
    let params = new HttpParams()
    .set('nombre', nombre);
    return this.http.get<any>(`${this.inventarios_url}/api/v1/inventarios/hotel`, { params });
  }

  listarHabitaciones(hotelId: string){
    let params = new HttpParams()
    .set('id', hotelId.toString());
    return this.http.get<any>(`${this.inventarios_url}/api/v1/inventarios/habitaciones`, { params });
  }

  obtenerReservas(listaHabitaciones: string[]){
    const body = {
      habitaciones: listaHabitaciones
    };
    return this.http.post<any>(`${this.reservas_url}/api/v1/reservas`, body);
  }

  confirmarReserva(reservaId: string){
    return this.http.post<any>(`${this.reservas_url}/api/v1/reservas/confirmar/${reservaId}`, {});
  }

  revocarReserva(reservaId: string){
    return this.http.post<any>(`${this.reservas_url}/api/v1/reservas/revocar/${reservaId}`, {});
  }

  obtenerUsuario(userId: string){
    const token = sessionStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.get<any>(`${this.users_url}/api/v1/auth/users/${userId}`, { headers });
  }
}
