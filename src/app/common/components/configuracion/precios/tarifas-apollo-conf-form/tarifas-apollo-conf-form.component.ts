import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ModalController} from '@ionic/angular';
import {TarifasExtrasService} from '../../../../../services/tarifas-extras.service';
import {GeneralService} from '../../../../../services/general.service';
import {SweetMessagesService} from '../../../../../services/sweet-messages.service';
import {ToastMessageService} from '../../../../../services/toast-message.service';
import {TarifasApolloConfService} from '../../../../../services/tarifas-apollo-conf.service';
import {TarifaApolloConfI} from '../../../../../interfaces/tarifas/tarifa-apollo-conf.interface';

@Component({
  selector: 'app-tarifas-apollo-conf',
  templateUrl: './tarifas-apollo-conf-form.component.html',
  styleUrls: ['./tarifas-apollo-conf-form.component.scss'],
})
export class TarifasApolloConfFormComponent implements OnInit {

  @Input() asModal: boolean;
  @Input() model: 'vehiculos' | 'tarifas_catalogos';
  public title: string;
  public tarifasApolloConf: TarifaApolloConfI[];
  constructor(
      public modalCtrl: ModalController,
      private fb: FormBuilder,
      private tarifasApolloConfServ: TarifasApolloConfService,
      private generalServ: GeneralService,
      private sweetMsg: SweetMessagesService,
      private toastServ: ToastMessageService
  ) {
    this.title = 'Formulario Tarifas, Frecuencias, Descuentos Apollo Conf.';
  }

  async ngOnInit() {
    await this.loadTarifasApolloConf();
  }

  async loadTarifasApolloConf() {
    let _payload = {
      model: this.model
    }
    this.generalServ.presentLoading();
    let res = await this.tarifasApolloConfServ._getActive(_payload);
    if (res.ok) {
      this.tarifasApolloConf = res.data;
    } else {
      this.sweetMsg.printStatusArray(res.errors.error.errors, 'error');
    }
    this.generalServ.dismissLoading();
  }

  saveUpdate(row: TarifaApolloConfI) {
    let success = 0;
    let errors = 0;
    let totalProcess = 0;
    this.sweetMsg.confirmRequest('¿Estás seguro de querar cambiar la configuración?', 'Esto afectará los precios de cada elemento en el listado').then(async (data) => {
      if (data.value) {
        for (let i = 0; i < this.tarifasApolloConf.length; i++) {
          if (this.tarifasApolloConf[i].ap_descuento === true || this.tarifasApolloConf[i].ap_descuento == 1) {
            totalProcess ++;
            let res = await this.tarifasApolloConfServ.saveUpdate(this.tarifasApolloConf[i], this.tarifasApolloConf[i].id);
            if (res.ok) {
              success ++;
            } else {
              errors ++;
              console.log(res.errors);
            }
          }
        }
        if (totalProcess === success) {
          this.sweetMsg.printStatus('Información actualizada correctamente', 'success');
        } else if (totalProcess > success && totalProcess < errors) {
          this.sweetMsg.printStatus('Se proceso su solicitud pero hay elementos que no fueron procesados correctamente, verifique la información', 'warning');
        } else if (totalProcess === errors) {
          this.sweetMsg.printStatus('Hubo un error al momento de procesar la información, intente nuevamente', 'error');
        }
      }
    })
  }

  dismiss(reload?) {
    this.modalCtrl.dismiss({
      reload
    });
  }

  reviewTarifaCapture(): boolean {
    let _haveErrors;
    if (this.tarifasApolloConf && this.tarifasApolloConf.length > 0) {
      for (let i = 0; i < this.tarifasApolloConf.length; i++) {
        if (this.tarifasApolloConf[i].required) {
          if (!this.tarifasApolloConf[i].frecuencia || this.tarifasApolloConf[i].frecuencia === '' || this.tarifasApolloConf[i].frecuencia === 'undefined') {
            if (!this.tarifasApolloConf[i].errors.find(x => x === 'Debe indicar una frecuencia valída')) {
              this.tarifasApolloConf[i].errors.push('Debe indicar una frecuencia valída');
            }
          } else {
            this.tarifasApolloConf[i].errors = [];
          }


          if (!this.tarifasApolloConf[i].frecuencia_ref || this.tarifasApolloConf[i].frecuencia_ref === '' || this.tarifasApolloConf[i].frecuencia_ref === 'undefined') {
            if (!this.tarifasApolloConf[i].errors.find(x => x === 'Debe indicar una referencia de frecuencia valída')) {
              this.tarifasApolloConf[i].errors.push('Debe indicar una referencia de frecuencia valída');
            }
          } else {
            this.tarifasApolloConf[i].errors = [];
          }

          if (!this.tarifasApolloConf[i].modelo || this.tarifasApolloConf[i].modelo === '' || this.tarifasApolloConf[i].modelo === 'undefined') {
            if (!this.tarifasApolloConf[i].errors.find(x => x === 'Debe indicar un modelo de datos correcto')) {
              this.tarifasApolloConf[i].errors.push('Debe indicar un modelo de datos correcto');
            }
          } else {
            this.tarifasApolloConf[i].errors = [];
          }

          if (this.tarifasApolloConf[i].ap_descuento === true && !this.tarifasApolloConf[i].valor_descuento || this.tarifasApolloConf[i].valor_descuento == 0) {
            if (!this.tarifasApolloConf[i].errors.find(x => x === 'Debe indicar un valor de descuento valído')) {
              this.tarifasApolloConf[i].errors.push('Debe indicar un valor de descuento valído');
            }
          } else {
            this.tarifasApolloConf[i].errors = [];
          }
          if (this.tarifasApolloConf[i].errors.length > 0) {
            _haveErrors = true;
          }
        }

      }
      if (_haveErrors === true) {
        return false;
      } else {
        return true
      }
    }
  }

}
