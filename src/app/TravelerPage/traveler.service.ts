import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateTravelerPayload, TravelerByUserIdResponse } from './traveler.models';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class TravelerService {
  private readonly http = inject(HttpClient);
  private api_url = environment.clientes; 

  createTraveler(payload: CreateTravelerPayload): Observable<unknown> {
    return this.http.post<unknown>(`${this.api_url}/api/v1/Travelers`, payload);
  }

  getTravelerByUserId(userId: string): Observable<TravelerByUserIdResponse> {
      return this.http.get<TravelerByUserIdResponse>(`${this.api_url}/api/v1/Travelers/Users/${userId}`);
    }
}
