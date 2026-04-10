import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SearchBarService } from '../searchbar.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { debounceTime } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { NavbarService } from '../../navbar/navbar.service';
import { CountryList } from '../../navbar/countrylist';

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

  ciudades: string[] = [];
  ciudadesFiltradas: string[] = [];

  currentCountry!: CountryList;

  currentCountryCode: string = 'CO';
  currentCurrency: string = 'COP';

  private initialParams: any = null;

  constructor(
    private fb: FormBuilder,
    private routerPath: Router,
    private searchBarService: SearchBarService,
    private navbarService: NavbarService,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      ciudad: ['', Validators.required],
      check_in: ['', Validators.required],
      check_out: ['', Validators.required],
      capacidad: [1, [Validators.required, Validators.min(1)]]
    });

    this.route.queryParams.subscribe(params => {
      this.initialParams = params;
    });

    this.navbarService.country$.subscribe((country: CountryList | null) => {
      if (country) {
        this.currentCountry = country;
        this.currentCountryCode = country.code;
        this.cargarCiudadesPorPais(country.code);
      }
    });

    this.navbarService.currency$.subscribe(currency => {
      this.currentCurrency = currency;
    });

    this.searchForm.get('ciudad')?.valueChanges
      .pipe(debounceTime(200))
      .subscribe(valor => {
        this.filtrarCiudades(valor);
        this.cd.detectChanges();
      });
  }

  cargarCiudadesPorPais(countryCode: string) {
    this.searchBarService.listadoCiudades(countryCode).subscribe({
      next: (data) => {
        this.ciudades = data;
        this.ciudadesFiltradas = [];

        if (this.initialParams) {
          this.searchForm.patchValue({
            ciudad: this.initialParams['ciudad'] || '',
            check_in: this.initialParams['check_in'] || '',
            check_out: this.initialParams['check_out'] || '',
            capacidad: this.initialParams['capacidad'] || 1
          });

          this.initialParams = null;
        }
      },
      error: () => {
        this.ciudades = [];
        this.ciudadesFiltradas = [];
      }
    });
  }

  filtrarCiudades(valor: string) {
    if (!valor || valor.trim() === '') {
      this.ciudadesFiltradas = [];
      return;
    }

    const texto = valor.toLowerCase();

    this.ciudadesFiltradas = this.ciudades.filter(c =>
      c.toLowerCase().includes(texto)
    );
  }

  seleccionarCiudad(ciudad: string) {
    this.searchForm.patchValue({ ciudad: ciudad }, { emitEvent: false });
    this.ciudadesFiltradas = [];
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
        capacidad,
        country_code: this.currentCountryCode,
        currency_code: this.currentCurrency
      }
    });
  }

  mostrarTodas() {
    this.ciudadesFiltradas = this.ciudades;
  }
}