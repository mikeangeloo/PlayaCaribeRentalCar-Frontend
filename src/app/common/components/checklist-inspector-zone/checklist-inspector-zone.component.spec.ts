import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ChecklistInspectorZoneComponent } from './checklist-inspector-zone.component';

describe('ChecklistInspectorZoneComponent', () => {
  let component: ChecklistInspectorZoneComponent;
  let fixture: ComponentFixture<ChecklistInspectorZoneComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ChecklistInspectorZoneComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ChecklistInspectorZoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
