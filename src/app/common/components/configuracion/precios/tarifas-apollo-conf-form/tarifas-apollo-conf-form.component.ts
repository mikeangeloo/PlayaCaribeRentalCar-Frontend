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
    this.title = 'Formulario Tarifas Apollo Conf.';
  }

  async ngOnInit() {
    await this.loadTarifasApolloConf();
  }

  async loadTarifasApolloConf() {
    this.generalServ.presentLoading();
    let res = await this.tarifasApolloConfServ._getActive();
    if (res.ok) {
      this.tarifasApolloConf = res.data;
    } else {
      this.sweetMsg.printStatusArray(res.errors.error.errors, 'error');
    }
    this.generalServ.dismissLoading();
  }

  saveUpdate(row: TarifaApolloConfI) {
    this.sweetMsg.confirmRequest('¿Estás seguro de querar cambiar la configuración?', 'Esto afectará los precios de cada vehículo en el listado').then((data) => {
      if (data.value) {
        this.tarifasApolloConfServ.saveUpdate(row, row.id).subscribe(res => {
          if (res.ok) {
            this.sweetMsg.printStatus(res.message, 'success');
            this.dismiss(true);
          }
        }, error => {
          console.log(error);
          this.sweetMsg.printStatusArray(error.error.errors, 'error');
        })
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
