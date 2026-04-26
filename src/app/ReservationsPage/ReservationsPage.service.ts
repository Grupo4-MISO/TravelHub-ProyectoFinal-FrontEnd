import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReservationsPageService {
  private reservas_url = environment.reservasUrl;
  private inventarios_url = environment.inventariosUrl;
  private auth_url = environment.authUrl;
  
constructor(private http: HttpClient) { }

  identificarUsuario(uuid: string){
    let params = new HttpParams()
    .set('uuid', uuid);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${sessionStorage.getItem('token')}`);
    return this.http.get<any>(`${this.auth_url}/api/v1/auth/users/${uuid}`, { headers });
  }

  cargarReservas(uuid: string){
    let params = new HttpParams()
    .set('uuid', uuid);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${sessionStorage.getItem('token')}`);
    return this.http.get<any>(`${this.reservas_url}/api/v1/reservas/usuario/${uuid}`, { headers });
  }

  cargarHoteles(habitaciones_ids: string[]){
    const body = { "habitaciones_ids": habitaciones_ids};
    return this.http.post<Record<string, unknown>>(`${this.inventarios_url}/api/v1/inventarios/hoteles`, body); 
  }

  cancelarReserva(reserva_id: string){
        return this.http.post<any>(`${this.reservas_url}/api/v1/reservas/revocar/${reserva_id}`, {});
  }


  
}
