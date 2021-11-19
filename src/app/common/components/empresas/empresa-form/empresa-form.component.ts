import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from "@ionic/angular";

@Component({
  selector: 'app-empresa-form',
  templateUrl: './empresa-form.component.html',
  styleUrls: ['./empresa-form.component.scss'],
})
export class EmpresaFormComponent implements OnInit {
  @Input() asModal: boolean;
  public title: string;
  constructor(
    public modalCtrl: ModalController,
  ) {
    this.title = '';
  }

  ngOnInit() {
  }

  dismiss() {
    this.modalCtrl.dismiss({
    });
  }
}
