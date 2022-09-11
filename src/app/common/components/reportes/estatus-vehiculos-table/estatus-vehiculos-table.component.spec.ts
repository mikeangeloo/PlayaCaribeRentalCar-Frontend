import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EstatusVehiculosTableComponent } from './estatus-vehiculos-table.component';

describe('EstatusVehiculosTableComponent', () => {
  let component: EstatusVehiculosTableComponent;
  let fixture: ComponentFixture<EstatusVehiculosTableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EstatusVehiculosTableComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EstatusVehiculosTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
