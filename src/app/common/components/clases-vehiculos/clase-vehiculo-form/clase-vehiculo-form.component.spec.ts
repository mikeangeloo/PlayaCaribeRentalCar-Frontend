import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ClaseVehiculoFormComponent } from './clase-vehiculo-form.component';

describe('ClaseVehiculoFormComponent', () => {
  let component: ClaseVehiculoFormComponent;
  let fixture: ComponentFixture<ClaseVehiculoFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaseVehiculoFormComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ClaseVehiculoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
