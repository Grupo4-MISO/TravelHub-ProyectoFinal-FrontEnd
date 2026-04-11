/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { CountryService } from './countryservice.service';

describe('Service: Navbar', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CountryService]
    });
  });

  it('should ...', inject([CountryService], (service: CountryService) => {
    expect(service).toBeTruthy();
  }));
});
