import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SearchBarService } from '../searchbar.service';
import { ListadoCiudades } from '../listado_ciudades';
import { ChangeDetectorRef } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { debounceTime } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.css'],
  standalone: false
})
export class SearchBarComponent implements OnInit {

  searchForm!: FormGroup;
  loading: boolean = false;
  error: string = '';
  ciudades: ListadoCiudades[] = [];
  ciudadesFiltradas: ListadoCiudades[] = [];

  constructor(
    private fb: FormBuilder,
    private routerPath: Router,
    private searchBarService: SearchBarService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      ciudad: ['', Validators.required],
      check_in: ['', Validators.required],
      check_out: ['', Validators.required],
      capacidad: [1, [Validators.required, Validators.min(1)]]
    });

    this.searchBarService.listadoCiudades().subscribe({
      next: (data) => {
        this.ciudades = data;
      }
    });

    this.searchForm.get('ciudad')?.valueChanges
      .pipe(debounceTime(200))
      .subscribe(valor => {
        this.filtrarCiudades(valor);
        this.cd.detectChanges();
      });
  }

  filtrarCiudades(valor: string) {
    if (!valor || valor.trim() === '') {
      this.ciudadesFiltradas = [];
      return;
    }

    const texto = valor.toLowerCase();

    this.ciudadesFiltradas = this.ciudades.filter(c =>
      c.ciudad.toLowerCase().includes(texto) ||
      c.pais.toLowerCase().includes(texto)
    );
  }

  seleccionarCiudad(ciudad: ListadoCiudades) {
    this.searchForm.patchValue({ ciudad: ciudad.ciudad }, { emitEvent: false });
    this.ciudadesFiltradas = [];
  }

  ResultsPage(): void {
    this.routerPath.navigate(['/results']);
  }

  buscar(): void {
    if (this.searchForm.invalid) {
      this.searchForm.markAllAsTouched();
      return;
    }

    const { ciudad, check_in, check_out, capacidad } = this.searchForm.value;

    this.routerPath.navigate(['/results'], {
      queryParams: {
        ciudad,
        check_in,
        check_out,
        capacidad
      }
    });
  }
}