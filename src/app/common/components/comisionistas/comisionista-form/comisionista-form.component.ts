import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ModalController} from "@ionic/angular";
import {GeneralService} from "../../../../services/general.service";
import {SweetMessagesService} from "../../../../services/sweet-messages.service";
import {ToastMessageService} from "../../../../services/toast-message.service";
import {ComisionistasI} from "../../../../interfaces/comisionistas/comisionistas.interface";
import {ComisionistasService} from "../../../../services/comisionistas.service";

@Component({
  selector: 'app-comisionista-form',
  templateUrl: './comisionista-form.component.html',
  styleUrls: ['./comisionista-form.component.scss'],
})
export class ComisionistaFormComponent implements OnInit {

  @Input() asModal: boolean;
  @Input() comisionista_id: number;
  @Input() loadLoading = true;
  @Input() empresa_id: number;
  public title: string;
  public comisionistaForm: FormGroup;
  public comisionistaData: ComisionistasI;
  public listOfComisiones = [];
  constructor(
    public modalCtrl: ModalController,
    private fb: FormBuilder,
    private comisionistasServ: ComisionistasService,
    private generalServ: GeneralService,
    private sweetMsg: SweetMessagesService,
    private toastServ: ToastMessageService
  ) {
    this.title = 'Formulario Comisionista';
    this.comisionistaForm = this.fb.group({
      id: [null],
      nombre: [null, Validators.required],
      apellidos: [null, Validators.required],
      tel_contacto: [null, Validators.required],
      email_contacto: [null, Validators.required],
      comisiones_pactadas: [null, Validators.required],
      activo: [null]
    });
  }

  get cf() {
    return this.comisionistaForm.controls;
  }

  async ngOnInit() {
    this.prepareComisionesList();
    if (this.comisionista_id) {
      this.loadComisionistasData();
    } else {
      this.initComisionistasForm();
    }
  }

  initComisionistasForm(data?) {
    this.comisionistaForm.setValue({
      id: (data && data.id) ? data.id : null,
      nombre: (data && data.nombre) ? data.nombre : null,
      apellidos: (data && data.apellidos) ? data.apellidos : null,
      tel_contacto: (data && data.tel_contacto) ? data.tel_contacto : null,
      email_contacto: (data && data.email_contacto) ? data.email_contacto : null,
      comisiones_pactadas: (data && data.comisiones_pactadas) ? data.comisiones_pactadas : null,
      activo: (data && data.activo) ? data.activo : 0,
    });
    this.comisionistaForm.controls.activo.disable();
  }

  prepareComisionesList() {
    let _limit = 400;
    let _value = 50;
    let _interation = (_limit / _value);
    let _acum = 0;
    for (let i = 0; i < _interation; i++) {
      _acum = _acum + _value;
      this.listOfComisiones.push(_acum)
    }
  }

  loadComisionistasData() {
    if (this.loadLoading) {
      this.generalServ.presentLoading();
    }

    this.comisionistasServ.getDataById(this.comisionista_id).subscribe(res => {
      if (this.loadLoading) {
        this.generalServ.dismissLoading();
      }

      if (res.ok === true) {
        this.initComisionistasForm(res.comisionista);
      }
    }, error => {
      if (this.loadLoading) {
        this.generalServ.dismissLoading();
      }
      console.log(error);
    });
  }
  saveUpdate() {
    if (this.comisionistaForm.invalid) {
      this.sweetMsg.printStatus('Debe llenar los campos requeridos', 'warning');
      this.comisionistaForm.markAllAsTouched();
      return;
    }
    if (this.loadLoading) {
      this.generalServ.presentLoading('Guardando cambios ...');
    }
    this.comisionistasServ.saveUpdate(this.comisionistaForm.value, this.comisionista_id).subscribe(res => {
      if (this.loadLoading) {
        this.generalServ.dismissLoading();
      }

      this.dismiss(true);
      if (res.ok === true) {
        this.toastServ.presentToast('success', res.message, 'top');
      }
    }, error => {
      console.log(error);
      this.sweetMsg.printStatusArray(error.error.errors, 'error');
      if (this.loadLoading) {
        this.generalServ.dismissLoading();
      }
    });
  }

  dismiss(reload?) {
    this.modalCtrl.dismiss({
      reload
    });
  }
}
