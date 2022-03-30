import { Component, OnInit } from '@angular/core';
import {CdkDragDrop} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-checklist-inspector-zone',
  templateUrl: './checklist-inspector-zone.component.html',
  styleUrls: ['./checklist-inspector-zone.component.scss'],
})
export class ChecklistInspectorZoneComponent implements OnInit {

  constructor() { }

  ngOnInit() {}

  catchEvent(event) {
    console.log('catchDragEvent -->', event);
  }
}
