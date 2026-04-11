import { TestBed } from '@angular/core/testing';
import { BookingHotelPageService } from './BookingHotelPage.service';

describe('Service: BookingHotelPage', () => {
  let service: BookingHotelPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BookingHotelPageService]
    });

    service = TestBed.inject(BookingHotelPageService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});