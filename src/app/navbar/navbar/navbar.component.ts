import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { CountryService } from '../countryservice.service';
import { CountryList } from '../countrylist';
import { NavbarService } from '../navbar.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: false
})
export class NavbarComponent implements OnInit {

  username: string | null = null;

  countries: CountryList[] = [];

  selectedCountry!: CountryList;
  selectedCurrency!: string;

  constructor(
    private authService: AuthService,
    private toastrService: ToastrService,
    private countryService: CountryService,
    private navbarService: NavbarService
  ) {}

  ngOnInit(): void {
    this.loadCountries();
  }

  loadCountries() {
    this.countryService.countryList().subscribe({
      next: (data) => {
        this.countries = data;

        // 🇨🇴 Default Colombia
        const colombia = this.countries.find(c => c.code === 'CO');

        if (colombia) {
          this.selectedCountry = colombia;
          this.selectedCurrency = colombia.CurrencyCode;

          // Notificar a toda la app
          this.navbarService.setCountry(colombia);
          this.navbarService.setCurrency(colombia.CurrencyCode);
        }
      },
      error: () => {
        this.toastrService.error('Error cargando países');
      }
    });
  }

  onCountryChange(country: CountryList) {
    this.selectedCountry = country;
    this.selectedCurrency = country.CurrencyCode;

    this.navbarService.setCountry(country);
    this.navbarService.setCurrency(country.CurrencyCode);
  }

  onCurrencyChange(currency: string) {
    this.selectedCurrency = currency;

    this.navbarService.setCurrency(currency);
  }

  // ---- AUTH ----
  get userRole(): string | null {
    return sessionStorage.getItem('role');
  }

  isAuthenticated(): boolean {
    this.username = sessionStorage.getItem('userName');
    return this.authService.isAuthenticated();
  }

  isNotAuthenticated(): boolean {
    return this.authService.isNotAuthenticated();
  }

  logout(): void {
    this.authService.logout();
    this.toastrService.success('Sesión cerrada correctamente.', 'Éxito');
  }
}