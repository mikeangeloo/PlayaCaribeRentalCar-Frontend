import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PolizasSegurosTableComponent } from './polizas-seguros-table.component';

describe('PolizasSegurosTableComponent', () => {
  let component: PolizasSegurosTableComponent;
  let fixture: ComponentFixture<PolizasSegurosTableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PolizasSegurosTableComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PolizasSegurosTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
