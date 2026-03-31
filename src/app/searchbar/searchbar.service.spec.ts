/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { SearchBarService } from './searchbar.service';

describe('Service: Searchbar', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SearchBarService]
    });
  });

  it('should ...', inject([SearchBarService], (service: SearchBarService) => {
    expect(service).toBeTruthy();
  }));
});
