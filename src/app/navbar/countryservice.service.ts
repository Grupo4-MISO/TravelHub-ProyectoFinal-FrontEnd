import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CountryList } from './countrylist';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  // Importamos URL del backend
  private api_url = environment.apiUrl;
  
  constructor(private http: HttpClient) { }

  countryList(): Observable<CountryList[]> {
    return this.http.get<CountryList[]>(`${this.api_url}/api/v1/inventarios/countries`);
  }
}
