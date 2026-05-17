/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { BillingPageService } from './billingPage.service';

describe('Service: BillingPage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BillingPageService]
    });
  });

  it('should ...', inject([BillingPageService], (service: BillingPageService) => {
    expect(service).toBeTruthy();
  }));
});
