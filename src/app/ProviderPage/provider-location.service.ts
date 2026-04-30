import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface CountryState {
  id: number;
  name: string;
  iso2: string;
}

export interface StateCity {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProviderLocationService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://api.countrystatecity.in/v1';
  private readonly headers = new HttpHeaders({
    'X-CSCAPI-KEY': '790a7c6431a121467f89ee0e11eb6a864a084f770ead8dabf63cf73100f757c3'
  });

  getStatesByCountry(countryCode: string): Observable<CountryState[]> {
    return this.http.get<CountryState[]>(`${this.baseUrl}/countries/${countryCode}/states`, {
      headers: this.headers
    });
  }

  getCitiesByState(countryCode: string, stateCode: string): Observable<StateCity[]> {
    return this.http.get<StateCity[]>(
      `${this.baseUrl}/countries/${countryCode}/states/${stateCode}/cities`,
      {
        headers: this.headers
      }
    );
  }
}
