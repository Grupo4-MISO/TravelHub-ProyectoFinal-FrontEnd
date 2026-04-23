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
  private auth_url = environment.authUrl;
  
constructor(private http: HttpClient) { }

  identificarUsuario(uuid: string){
    let params = new HttpParams()
    .set('uuid', uuid);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${sessionStorage.getItem('token')}`);
    return this.http.get<any>(`${this.auth_url}/api/v1/auth/users/${uuid}`, { headers });
  }


}
