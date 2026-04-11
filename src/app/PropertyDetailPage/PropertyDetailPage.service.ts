import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PropertyDetail } from './property-detail';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PropertyDetailPageService {
    
  private api_url = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getPropertyById(id: string): Observable<PropertyDetail> {
    return this.http.get<PropertyDetail>(`${this.api_url}/api/v1/inventarios/hospedajes/${id}`);
  }
}