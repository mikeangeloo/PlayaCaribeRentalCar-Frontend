import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FrecuenciaConfComponent } from './frecuencia-conf.component';

describe('FrecuenciaConfComponent', () => {
  let component: FrecuenciaConfComponent;
  let fixture: ComponentFixture<FrecuenciaConfComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FrecuenciaConfComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FrecuenciaConfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
