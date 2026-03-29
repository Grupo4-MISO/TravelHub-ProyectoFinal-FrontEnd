// import { environment } from '../../environments/environment';
import { HttpParams } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchBar } from './searchbar';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class SearchBarService {
    // Importamos URL del backend
    private api_url = 'http://a4ac82cb515834c5981857cba02bb462-982938479.us-east-1.elb.amazonaws.com';

    constructor(private http: HttpClient) { }

    buscarHospedajes(ciudad: string, check_in: string, check_out: string, capacidad: number): Observable<SearchBar[]> {
        // Cadena de consulta para el backend
        let params = new HttpParams()
            .set('ciudad', ciudad)
            .set('check_in', check_in)
            .set('check_out', check_out)
            .set('capacidad', capacidad.toString());
        
        // Realizamos la peticion GET al backend
        return this.http.get<SearchBar[]>(`${this.api_url}/api/v1/busquedas/search`, { params });
    }
}