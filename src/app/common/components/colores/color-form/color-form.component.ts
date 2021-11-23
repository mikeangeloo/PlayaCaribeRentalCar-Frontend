import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MarcasI} from "../../../../interfaces/marcas.interface";
import {ModalController} from "@ionic/angular";
import {MarcasService} from "../../../../services/marcas.service";
import {GeneralService} from "../../../../services/general.service";
import {SweetMessagesService} from "../../../../services/sweet-messages.service";
import {ToastMessageService} from "../../../../services/toast-message.service";
import {ColoresI} from "../../../../interfaces/colores.interface";
import {ColoresService} from "../../../../services/colores.service";

@Component({
  selector: 'app-color-form',
  templateUrl: './color-form.component.html',
  styleUrls: ['./color-form.component.scss'],
})
export class ColorFormComponent implements OnInit {

  @Input() asModal: boolean;
  @Input() color_id: number;
  public title: string;
  public colorForm: FormGroup;
  public colorData: ColoresI;
  constructor(
    public modalCtrl: ModalController,
    private fb: FormBuilder,
    private colorServ: ColoresService,
    private generalServ: GeneralService,
    private sweetMsg: SweetMessagesService,
    private toastServ: ToastMessageService
  ) {
    this.title = 'Formulario Color Vehículos';
    this.colorForm = this.fb.group({
      id: [null],
      color: [null, Validators.required],
      activo: [null]
    });
  }

  get cf() {
    return this.colorForm.controls;
  }

  ngOnInit() {
    if (this.color_id) {
      this.loadColorData();
    } else {
      this.initColorForm();
    }
  }

  initColorForm(data?) {
    this.colorForm.setValue({
      id: (data && data.id) ? data.id : null,
      color: (data && data.color) ? data.color : null,
      activo: (data && data.activo) ? data.activo : 0,
    });
    this.cf.activo.disable();
  }



  loadColorData() {
    this.generalServ.presentLoading();
    this.colorServ.getDataById(this.color_id).subscribe(res => {
      this.generalServ.dismissLoading();
      if (res.ok === true) {
        this.initColorForm(res.color);
      }
    }, error => {
      this.generalServ.dismissLoading();
      console.log(error);
    });
  }

  saveUpdate() {
    if (this.colorForm.invalid) {
      this.sweetMsg.printStatus('Debe llenar los campos requeridos', 'warning');
      this.colorForm.markAllAsTouched();
      return;
    }
    this.generalServ.presentLoading('Guardando cambios ...');
    this.colorServ.saveUpdate(this.colorForm.value, this.color_id).subscribe(res => {
      this.generalServ.dismissLoading();
      this.dismiss(true);
      if (res.ok === true) {
        this.toastServ.presentToast('success', res.message, 'top');
      }
    }, error => {
      console.log(error);
      this.generalServ.dismissLoading();
    });
  }

  dismiss(reload?) {
    this.modalCtrl.dismiss({
      reload
    });
  }
}
