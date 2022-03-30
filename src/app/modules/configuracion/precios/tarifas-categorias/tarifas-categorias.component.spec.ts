import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TarifasCategoriasComponent } from './tarifas-categorias.component';

describe('TarifasCategoriasComponent', () => {
  let component: TarifasCategoriasComponent;
  let fixture: ComponentFixture<TarifasCategoriasComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TarifasCategoriasComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TarifasCategoriasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
