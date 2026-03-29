import { SearchBarService } from '../../searchbar/searchbar.service';
import { SearchBar } from '../../searchbar/searchbar';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ResultsPage',
  templateUrl: './ResultsPage.component.html',
  styleUrls: ['./ResultsPage.component.css'],
  standalone: false
})
export class ResultsPageComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private searchService: SearchBarService
  ) { }

  resultados: SearchBar[] = [{
      habitacion_id: '1',
      hospedaje_id: '1',
      nombre: 'Hotel Test',
      pais: 'Testland',
      ciudad: 'Test City',
      direccion: '123 Test St',
      rating: 4.5,
      capacidad: 2,
      precio: 100,
      descripcion: 'Habitación deluxe'
  },
{
      habitacion_id: '1',
      hospedaje_id: '1',
      nombre: 'Hotel Test',
      pais: 'Testland',
      ciudad: 'Test City',
      direccion: '123 Test St',
      rating: 5,
      capacidad: 2,
      precio: 100,
      descripcion: 'Habitación deluxe'
  },
{
      habitacion_id: '1',
      hospedaje_id: '1',
      nombre: 'Hotel Test',
      pais: 'Testland',
      ciudad: 'Test City',
      direccion: '123 Test St',
      rating: 3.5,
      capacidad: 2,
      precio: 100,
      descripcion: 'Habitación deluxe'
  },
{
      habitacion_id: '1',
      hospedaje_id: '1',
      nombre: 'Hotel Test',
      pais: 'Testland',
      ciudad: 'Test City',
      direccion: '123 Test St',
      rating: 2.5,
      capacidad: 2,
      precio: 100,
      descripcion: 'Habitación deluxe'
  }];

  loading = false;
  error = '';

  buscar(ciudad: string, check_in: string, check_out: string, capacidad: number) {
    this.loading = true;
    this.resultados = this.resultados;
    this.loading = false;

    // this.searchService.buscarHospedajes(ciudad, check_in, check_out, capacidad)
    //   .subscribe({
    //     next: (data) => {
    //       this.resultados = data;
    //       this.loading = false;
    //     },
    //     error: (data) => {
    //       this.error = data;
    //       this.loading = false;
    //     }
    //   });
  }

  getStarArray(rating: number): number[] {
    return Array(Math.floor(rating));
  }

  getEmptyStarArray(rating: number): number[] {
    return Array(5 - Math.floor(rating));
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const { ciudad, check_in, check_out, capacidad } = params;

      if (ciudad && check_in && check_out && capacidad) {
        this.buscar(ciudad, check_in, check_out, capacidad);
      }
    });
  }
}
