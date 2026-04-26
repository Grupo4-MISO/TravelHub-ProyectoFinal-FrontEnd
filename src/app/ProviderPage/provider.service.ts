import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateProviderPayload, ProviderByUserIdResponse } from './provider.models';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ProviderService {
  private readonly http = inject(HttpClient);
  private api_url = environment.proveedores; 

  createProvider(payload: CreateProviderPayload): Observable<unknown> {
    return this.http.post<unknown>(`${this.api_url}/api/v1/Managers`, payload);
  }

  getProviderByUserId(userId: string): Observable<ProviderByUserIdResponse> {
    return this.http.get<ProviderByUserIdResponse>(`${this.api_url}/api/v1/Managers/providers/${userId}`);
  }
}
