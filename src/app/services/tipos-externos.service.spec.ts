import { TestBed } from '@angular/core/testing';

import { TiposExternosService } from './tipos-externos.service';

describe('TiposExternosService', () => {
  let service: TiposExternosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TiposExternosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
