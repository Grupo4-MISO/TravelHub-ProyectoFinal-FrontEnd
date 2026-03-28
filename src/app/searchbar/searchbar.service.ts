import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchBar } from './searchbar';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class SearchBarService {
    // Importamos URL del backend
    private api_url = environment.apiUrl;

    constructor(private http: HttpClient) { }

    buscarHospedajes(ciudad: string, check_in: string, check_out: string, capacidad: number): Observable<SearchBar[]> {
        // Cadena de consulta para el backend
        let params: string = `?ciudad=${ciudad}&check_in=${check_in}&check_out=${check_out}&capacidad=${capacidad}`;
        
        // Realizamos la peticion GET al backend
        return this.http.get<SearchBar[]>(`${this.api_url}/api/v1/busquedas/search${params}`);
    }
}