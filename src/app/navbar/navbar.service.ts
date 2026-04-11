import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CountryList } from './countrylist';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {

  private readonly STORAGE_COUNTRY_ID = 'navbar_selected_country_id';
  private readonly STORAGE_CURRENCY = 'navbar_selected_currency';

  private countrySubject = new BehaviorSubject<CountryList | null>(null);
  country$ = this.countrySubject.asObservable();

  private currencySubject = new BehaviorSubject<string>('COP');
  currency$ = this.currencySubject.asObservable();

  constructor() {
    // Restaurar moneda desde localStorage al iniciar el servicio
    const savedCurrency = localStorage.getItem(this.STORAGE_CURRENCY);
    if (savedCurrency) {
      this.currencySubject.next(savedCurrency);
    }
  }

  setCountry(country: CountryList, updateCurrency: boolean = true) {
    this.countrySubject.next(country);
    localStorage.setItem(this.STORAGE_COUNTRY_ID, country.id);
    if (updateCurrency) {
      this.setCurrency(country.CurrencyCode);
    }
  }

  setCurrency(currency: string) {
    this.currencySubject.next(currency);
    localStorage.setItem(this.STORAGE_CURRENCY, currency);
  }

  getSavedCountryId(): string | null {
    return localStorage.getItem(this.STORAGE_COUNTRY_ID);
  }

  getSavedCurrency(): string | null {
    return localStorage.getItem(this.STORAGE_CURRENCY);
  }

  getCurrentCountry(): CountryList | null {
    return this.countrySubject.value;
  }

  getCurrentCurrency(): string {
    return this.currencySubject.value;
  }
}