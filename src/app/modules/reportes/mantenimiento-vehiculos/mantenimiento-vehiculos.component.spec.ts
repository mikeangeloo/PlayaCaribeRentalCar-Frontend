import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MantenimientoVehiculosComponent } from './mantenimiento-vehiculos.component';

describe('MantenimientoVehiculosComponent', () => {
  let component: MantenimientoVehiculosComponent;
  let fixture: ComponentFixture<MantenimientoVehiculosComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MantenimientoVehiculosComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MantenimientoVehiculosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
