import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CountryList } from './countrylist';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {

  private countrySubject = new BehaviorSubject<CountryList | null>(null);
  country$ = this.countrySubject.asObservable();

  private currencySubject = new BehaviorSubject<string>('COP');
  currency$ = this.currencySubject.asObservable();

  setCountry(country: CountryList) {
    this.countrySubject.next(country);
  }

  setCurrency(currency: string) {
    this.currencySubject.next(currency);
  }
}