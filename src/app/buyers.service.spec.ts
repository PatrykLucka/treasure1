import { TestBed, inject } from '@angular/core/testing';

import { BuyersService } from './buyers.service';

describe('BuyersService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BuyersService]
    });
  });

  it('should be created', inject([BuyersService], (service: BuyersService) => {
    expect(service).toBeTruthy();
  }));
});
