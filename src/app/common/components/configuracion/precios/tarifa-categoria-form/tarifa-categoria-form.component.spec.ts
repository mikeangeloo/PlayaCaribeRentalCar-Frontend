import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TarifaCategoriaFormComponent } from './tarifa-categoria-form.component';

describe('TarifaCategoriaFormComponent', () => {
  let component: TarifaCategoriaFormComponent;
  let fixture: ComponentFixture<TarifaCategoriaFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TarifaCategoriaFormComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TarifaCategoriaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
