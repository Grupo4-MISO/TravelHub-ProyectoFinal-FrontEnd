import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CountryList } from './countrylist';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  // Importamos URL del backend
  private api_url = 'http://a37f9013b4f114474b89eabea8dc6d88-943704764.us-east-1.elb.amazonaws.com';
  // private api_url = 'http://127.0.0.1:5000/'
  
  constructor(private http: HttpClient) { }

  countryList(): Observable<CountryList[]> {
    return this.http.get<CountryList[]>(`${this.api_url}/api/v1/inventarios/countries`);
  }
}
