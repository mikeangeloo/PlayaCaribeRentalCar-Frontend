import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditCatVehiculoComponent } from './edit-cat-vehiculo.component';

describe('EditCatVehiculoComponent', () => {
  let component: EditCatVehiculoComponent;
  let fixture: ComponentFixture<EditCatVehiculoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCatVehiculoComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditCatVehiculoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
