import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TarifasExtrasTableComponent } from './tarifas-extras-table.component';

describe('TarifasExtrasTableComponent', () => {
  let component: TarifasExtrasTableComponent;
  let fixture: ComponentFixture<TarifasExtrasTableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TarifasExtrasTableComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TarifasExtrasTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
