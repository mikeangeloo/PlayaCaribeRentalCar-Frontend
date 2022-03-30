import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TarifasCategoriasTableComponent } from './tarifas-categorias-table.component';

describe('TarifasCategoriasTableComponent', () => {
  let component: TarifasCategoriasTableComponent;
  let fixture: ComponentFixture<TarifasCategoriasTableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TarifasCategoriasTableComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TarifasCategoriasTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
