import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AreasTrabajoListComponent } from './areas-trabajo-list.component';

describe('AreasTrabajoListComponent', () => {
  let component: AreasTrabajoListComponent;
  let fixture: ComponentFixture<AreasTrabajoListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AreasTrabajoListComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AreasTrabajoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
