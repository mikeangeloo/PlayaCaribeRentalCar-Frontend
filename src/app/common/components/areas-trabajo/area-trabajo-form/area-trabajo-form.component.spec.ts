import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AreaTrabajoFormComponent } from './area-trabajo-form.component';

describe('AreaTrabajoFormComponent', () => {
  let component: AreaTrabajoFormComponent;
  let fixture: ComponentFixture<AreaTrabajoFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AreaTrabajoFormComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AreaTrabajoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
