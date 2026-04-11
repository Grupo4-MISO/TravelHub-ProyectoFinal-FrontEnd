import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PropertyDetail } from './property-detail';

@Injectable({
  providedIn: 'root'
})
export class PropertyDetailPageService {
    
    private api_url = 'http://a37f9013b4f114474b89eabea8dc6d88-943704764.us-east-1.elb.amazonaws.com';
  //private api_url = 'http://127.0.0.1:5000';

  constructor(private http: HttpClient) { }

  getPropertyById(id: string): Observable<PropertyDetail> {
    return this.http.get<PropertyDetail>(`${this.api_url}/api/v1/inventarios/hospedajes/${id}`);
  }
}