import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PopularAccommodation } from './popular-accommodation';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PrincipalPageService {
  private api_url = environment.inventariosUrl;

  constructor(private http: HttpClient) { }

  getPopularAccommodations(countryCode: string): Observable<PopularAccommodation[]> {
    return this.http.get<PopularAccommodation[]>(
      `${this.api_url}/api/v1/inventarios/countries/${countryCode}/popular-accommodations`
    );
  }
}
