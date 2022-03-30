import { TestBed } from '@angular/core/testing';

import { TarifasCategoriasService } from './tarifas-categorias.service';

describe('TarifasCategoriasService', () => {
  let service: TarifasCategoriasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TarifasCategoriasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
