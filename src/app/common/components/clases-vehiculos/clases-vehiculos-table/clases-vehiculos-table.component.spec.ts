import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ClasesVehiculosTableComponent } from './clases-vehiculos-table.component';

describe('ClasesVehiculosTableComponent', () => {
  let component: ClasesVehiculosTableComponent;
  let fixture: ComponentFixture<ClasesVehiculosTableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ClasesVehiculosTableComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ClasesVehiculosTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
