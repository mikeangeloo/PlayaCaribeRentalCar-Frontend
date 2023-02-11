import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TiposCambiosTableComponent } from './tipos-cambios-table.component';

describe('TiposCambiosTableComponent', () => {
  let component: TiposCambiosTableComponent;
  let fixture: ComponentFixture<TiposCambiosTableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TiposCambiosTableComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TiposCambiosTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
