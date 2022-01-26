import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TarifasExtrasFormComponent } from './tarifas-extras-form.component';

describe('TarifasExtrasFormComponent', () => {
  let component: TarifasExtrasFormComponent;
  let fixture: ComponentFixture<TarifasExtrasFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TarifasExtrasFormComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TarifasExtrasFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
