/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { SearchbarService } from './searchbar.service';

describe('Service: Searchbar', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SearchbarService]
    });
  });

  it('should ...', inject([SearchbarService], (service: SearchbarService) => {
    expect(service).toBeTruthy();
  }));
});
