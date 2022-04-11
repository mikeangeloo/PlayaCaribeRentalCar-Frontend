import {Component, Input, OnInit} from '@angular/core';
import {CdkDragDrop, CdkDragEnd} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-checklist-inspector-zone',
  templateUrl: './checklist-inspector-zone.component.html',
  styleUrls: ['./checklist-inspector-zone.component.scss'],
})
export class ChecklistInspectorZoneComponent implements OnInit {

  @Input() width: number;
  @Input() height: number;
  constructor() { }

  ngOnInit() {}

  catchEvent(event: CdkDragEnd, element) {
    console.log('catchDragEvent -->', event.source.getFreeDragPosition());
    console.log('dragElement --->', element);
  }
}
