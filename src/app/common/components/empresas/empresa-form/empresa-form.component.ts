import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from "@ionic/angular";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-empresa-form',
  templateUrl: './empresa-form.component.html',
  styleUrls: ['./empresa-form.component.scss'],
})
export class EmpresaFormComponent implements OnInit {
  @Input() asModal: boolean;
  @Input() empresa_id: number;
  public title: string;
  public empresaForm: FormGroup;
  constructor(
    public modalCtrl: ModalController,
    private fb: FormBuilder
  ) {
    this.title = '';
    // this.empresaForm = this.fb.group({
    //   ''
    // })
  }

  ngOnInit() {
  }

  dismiss() {
    this.modalCtrl.dismiss({
    });
  }
}
