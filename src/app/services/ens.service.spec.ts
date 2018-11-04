import { TestBed, inject } from '@angular/core/testing';

import { EnsService } from './ens.service';

describe('EnsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EnsService]
    });
  });

  it('should be created', inject([EnsService], (service: EnsService) => {
    expect(service).toBeTruthy();
  }));
});
