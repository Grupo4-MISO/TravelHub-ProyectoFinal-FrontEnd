import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PropertyReviewComment } from './property-review';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PropertyReviewsService {
  private api_url = environment.comentariosUrl || environment.authUrl;

  constructor(private http: HttpClient) { }

  getReviewsUrl(hospedajeId: string): string {
    return `${this.api_url}/api/v1/reviews/hospedajes/${hospedajeId}}`;
  }

  getReviewsByHospedajeId(hospedajeId: string): Observable<PropertyReviewComment[]> {
    return this.http.get<PropertyReviewComment[]>(this.getReviewsUrl(hospedajeId));
  }

}