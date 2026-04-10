/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { BookingHotelPageService } from './BookingHotelPage.service';

describe('Service: BookingHotelPage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BookingHotelPageService]
    });
  });

  it('should ...', inject([BookingHotelPageService], (service: BookingHotelPageService) => {
    expect(service).toBeTruthy();
  }));
});
