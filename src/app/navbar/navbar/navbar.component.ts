import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { CountryService } from '../countryservice.service';
import { CountryList } from '../countrylist';
import { NavbarService } from '../navbar.service';
import { Subscription } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: false
})
export class NavbarComponent implements OnInit, OnDestroy {
  username: string | null = null;
  countries: CountryList[] = [];
  selectedCountry!: CountryList;
  selectedCurrency!: string;

  private subscriptions = new Subscription();

  constructor(
    private authService: AuthService,
    private toastrService: ToastrService,
    private countryService: CountryService,
    private navbarService: NavbarService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCountries();
    this.subscribeToServiceChanges();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private subscribeToServiceChanges(): void {
    this.subscriptions.add(
      this.navbarService.country$.subscribe(country => {
        if (country && country !== this.selectedCountry) {
          this.selectedCountry = country;
        }
      })
    );
    this.subscriptions.add(
      this.navbarService.currency$.subscribe(currency => {
        if (currency && currency !== this.selectedCurrency) {
          this.selectedCurrency = currency;
        }
      })
    );
  }

    loadCountries() {
    this.countryService.countryList().subscribe({
      next: (data) => {
        this.countries = data;

        const savedCountryId = this.navbarService.getSavedCountryId();
        let selectedCountry: CountryList | undefined;
        if (savedCountryId) {
          selectedCountry = this.countries.find(c => c.id === savedCountryId);
        }
        if (!selectedCountry) {
          selectedCountry = this.countries.find(c => c.code === 'CO');
        }

        let savedCurrency = this.navbarService.getSavedCurrency();
        if (!savedCurrency || !this.countries.some(c => c.CurrencyCode === savedCurrency)) {
          savedCurrency = selectedCountry?.CurrencyCode || 'COP';
        }

        if (selectedCountry) {
          this.selectedCountry = selectedCountry;
          this.selectedCurrency = savedCurrency;
          this.navbarService.setCountry(selectedCountry, false);
          this.navbarService.setCurrency(savedCurrency);
        }

        this.cdr.detectChanges(); // Forzar actualización de la vista
      },
      error: () => {
        this.toastrService.error('Error cargando países');
        this.cdr.detectChanges();
      }
    });
  }

  compareCountries(c1: CountryList, c2: CountryList): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  onCountryChange(country: CountryList) {
    this.selectedCountry = country;
    this.selectedCurrency = country.CurrencyCode;
    this.navbarService.setCountry(country, true); // Actualiza país y moneda
  }

  onCurrencyChange(currency: string) {
    this.selectedCurrency = currency;
    this.navbarService.setCurrency(currency);
  }

  // ---- AUTH (sin cambios) ----
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