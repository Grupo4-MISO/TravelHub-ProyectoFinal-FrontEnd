import { environment } from '../../environments/environment';
import { HttpParams } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchBar } from './searchbar';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class SearchBarService {
    private busquedas_url = environment.searchUrl;
    private inventarios_url = environment.inventariosUrl;

    constructor(private http: HttpClient) { }

    buscarHospedajes(ciudad: string, check_in: string, check_out: string, capacidad: number, country_code: string, currency_code: string): Observable<SearchBar[]> {
        // Cadena de consulta para el backend
        let params = new HttpParams()
            .set('ciudad', ciudad)
            .set('check_in', check_in)
            .set('check_out', check_out)
            .set('capacidad', capacidad.toString())
            .set('country_code', country_code)
            .set('currency_code', currency_code);

        // Realizamos la peticion GET al backend
        return this.http.get<SearchBar[]>(`${this.busquedas_url}/api/v1/busquedas/search`, { params });
    }

    listadoCiudades(country_code: string): Observable<string[]> {
        // Realizamos la peticion GET al backend para obtener las ciudades disponibles por pais
        return this.http.get<string[]>(`${this.inventarios_url}/api/v1/inventarios/countries/${country_code}/popular-cities`);
    }
}