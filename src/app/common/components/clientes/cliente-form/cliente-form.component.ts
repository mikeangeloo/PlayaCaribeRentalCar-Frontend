import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {EmpresasI} from "../../../../interfaces/empresas/empresas.interface";
import {ModalController} from "@ionic/angular";
import {EmpresasService} from "../../../../services/empresas.service";
import {GeneralService} from "../../../../services/general.service";
import {SweetMessagesService} from "../../../../services/sweet-messages.service";
import {ToastMessageService} from "../../../../services/toast-message.service";
import {ComisionistasI} from "../../../../interfaces/comisionistas/comisionistas.interface";
import {ComisionistaFormComponent} from "../../empresas/comisionistas/comisionista-form/comisionista-form.component";
import {ClientesI} from "../../../../interfaces/clientes/clientes.interface";
import {ClientesService} from "../../../../services/clientes.service";
import {Months} from "../../../../interfaces/shared/months";
import {TarjetaFormComponent} from "../../tarjetas/tarjeta-form/tarjeta-form.component";
import {CardI} from "../../../../interfaces/cards/card.interface";

@Component({
  selector: 'app-cliente-form',
  templateUrl: './cliente-form.component.html',
  styleUrls: ['./cliente-form.component.scss'],
})
export class ClienteFormComponent implements OnInit {

  @Input() asModal: boolean;
  @Input() cliente_id: number;
  public title: string;
  public clienteForm: FormGroup;
  public clienteData: ClientesI;

  public months = Months;
  public validYears: any[];

  constructor(
    public modalCtrl: ModalController,
    private fb: FormBuilder,
    private clientesServ: ClientesService,
    private generalServ: GeneralService,
    private sweetMsg: SweetMessagesService,
    private toastServ: ToastMessageService,
    public modalCtr: ModalController,
  ) {
    this.title = 'Formulario Cliente';
    this.clienteForm = this.fb.group({
      id: [null],
      nombre: [null, Validators.required],
      apellidos: [null, Validators.required],
      telefono: [null, Validators.required],
      num_licencia: [null, Validators.required],
      licencia_mes: [null, Validators.required],
      licencia_ano: [null, Validators.required],
      email: [null, Validators.required],
      activo: [null]
    });
  }

  get cf() {
    return this.clienteForm.controls;
  }

  ngOnInit() {
    this.validYears = this.generalServ.getYears();
    if (this.cliente_id) {
      this.loadClienteData();
    } else {
      this.initClienteForm();
    }
  }

  initClienteForm(data?) {
    this.clienteForm.setValue({
      id: (data && data.id) ? data.id : null,
      nombre: (data && data.nombre) ? data.nombre : null,
      apellidos: (data && data.apellidos) ? data.apellidos : null,
      telefono: (data && data.telefono) ? data.telefono : null,
      num_licencia: (data && data.num_licencia) ? data.num_licencia : null,
      licencia_mes: (data && data.licencia_mes) ? data.licencia_mes : null,
      licencia_ano: (data && data.licencia_ano) ? data.licencia_ano : null,
      email: (data && data.email) ? data.email : null,
      activo: (data && data.activo) ? data.activo : 0,
    });
    this.clienteForm.controls.activo.disable();
  }



  loadClienteData() {
    this.generalServ.presentLoading();
    this.clientesServ.getDataById(this.cliente_id).subscribe(res => {
      this.generalServ.dismissLoading();
      if (res.ok === true) {
        this.clienteData = res.cliente;
        this.initClienteForm(res.cliente);
      }
    }, error => {
      this.generalServ.dismissLoading();
      console.log(error);
    });
  }

  saveUpdate() {
    if (this.clienteForm.invalid) {
      this.sweetMsg.printStatus('Debe llenar los campos requeridos', 'warning');
      this.clienteForm.markAllAsTouched();
      return;
    }
    this.generalServ.presentLoading('Guardando cambios ...');
    this.clientesServ.saveUpdate(this.clienteForm.value, this.cliente_id).subscribe(res => {
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

  async openTarjetaForm(_data?: CardI) {
    const pageEl: HTMLElement = document.querySelector('.ion-page');
    //this.generalService.presentLoading();
    const modal = await this.modalCtr.create({
      component: TarjetaFormComponent,
      componentProps: {
        'asModal': true,
        'card_id': (_data && _data.id) ? _data.id : null,
        'cliente_id': this.cliente_id,
        'loadLoading': false
      },
      swipeToClose: true,
      cssClass: 'edit-form',
      presentingElement: pageEl
    });
    await modal.present();
    const {data} = await modal.onWillDismiss();
    if (data.reload && data.reload === true) {
      this.loadClienteData();
    }
  }
}
