import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CobroDepositoModalComponent } from './cobro-deposito-modal.component';

describe('CobroDepositoModalComponent', () => {
  let component: CobroDepositoModalComponent;
  let fixture: ComponentFixture<CobroDepositoModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CobroDepositoModalComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CobroDepositoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
