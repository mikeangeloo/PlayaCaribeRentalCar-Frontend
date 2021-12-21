import { TestBed } from '@angular/core/testing';

import { CategoriaVehiculosService } from './categoria-vehiculos.service';

describe('ModelosService', () => {
  let service: CategoriaVehiculosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoriaVehiculosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
