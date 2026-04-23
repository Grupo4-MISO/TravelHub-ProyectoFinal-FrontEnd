/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ReservationsPageService } from './ReservationsPage.service';

describe('Service: ReservationsPage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReservationsPageService]
    });
  });

  it('should ...', inject([ReservationsPageService], (service: ReservationsPageService) => {
    expect(service).toBeTruthy();
  }));
});
