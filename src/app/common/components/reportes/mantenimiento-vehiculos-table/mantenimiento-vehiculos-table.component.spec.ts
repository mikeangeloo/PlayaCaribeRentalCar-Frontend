import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MantenimientoVehiculosTableComponent } from './mantenimiento-vehiculos-table.component';

describe('MantenimientoVehiculosTableComponent', () => {
  let component: MantenimientoVehiculosTableComponent;
  let fixture: ComponentFixture<MantenimientoVehiculosTableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MantenimientoVehiculosTableComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MantenimientoVehiculosTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
