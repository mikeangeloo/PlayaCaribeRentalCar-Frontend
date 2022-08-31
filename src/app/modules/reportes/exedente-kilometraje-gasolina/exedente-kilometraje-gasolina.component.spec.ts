import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExedenteKilometrajeGasolinaComponent } from './exedente-kilometraje-gasolina.component';

describe('ExedenteKilometrajeGasolinaComponent', () => {
  let component: ExedenteKilometrajeGasolinaComponent;
  let fixture: ComponentFixture<ExedenteKilometrajeGasolinaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ExedenteKilometrajeGasolinaComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ExedenteKilometrajeGasolinaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
