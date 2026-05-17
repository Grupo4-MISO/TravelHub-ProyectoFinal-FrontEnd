import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BillingPageService {
  private transactionsUrl = environment.trasacciones;

constructor(private http: HttpClient) { }

  darPagosHotel(hotelId: string, month: number, year: number){
    const token = sessionStorage.getItem('token');
    const params = new HttpParams()
    .set('month', month)
    .set('year', year);
    const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.transactionsUrl}/api/v1/Transactions/payments/property/${hotelId}`, { params, headers });
  }

}
