import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CountryList } from './countrylist';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  // Importamos URL del backend
  private api_url = 'http://a9632d3648c204ee7809bde69b5b6eb8-421692685.us-east-1.elb.amazonaws.com';

  constructor(private http: HttpClient) { }

  countryList(): Observable<CountryList[]> {
    return this.http.get<CountryList[]>(`${this.api_url}/api/v1/inventarios/countries`);
  }
}
