import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExedenteKilometrajeGasolinaTableComponent } from './exedente-kilometraje-gasolina-table.component';

describe('ExedenteKilometrajeGasolinaTableComponent', () => {
  let component: ExedenteKilometrajeGasolinaTableComponent;
  let fixture: ComponentFixture<ExedenteKilometrajeGasolinaTableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ExedenteKilometrajeGasolinaTableComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ExedenteKilometrajeGasolinaTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
