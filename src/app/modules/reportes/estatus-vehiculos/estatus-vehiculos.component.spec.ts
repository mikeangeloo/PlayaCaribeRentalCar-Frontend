import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EstatusVehiculosComponent } from './estatus-vehiculos.component';

describe('EstatusVehiculosComponent', () => {
  let component: EstatusVehiculosComponent;
  let fixture: ComponentFixture<EstatusVehiculosComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EstatusVehiculosComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EstatusVehiculosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
