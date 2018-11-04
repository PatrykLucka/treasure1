import { TestBed, inject } from '@angular/core/testing';

import { EmployeeResolverService } from './employee-resolver.service';

describe('EmployeeResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmployeeResolverService]
    });
  });

  it('should be created', inject([EmployeeResolverService], (service: EmployeeResolverService) => {
    expect(service).toBeTruthy();
  }));
});
