import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {CardsConfig} from "../../../../interfaces/cards/cards-config";
import {Months} from "../../../../interfaces/shared/months";
import {CardConfig} from "../../../../interfaces/cards/cardConfig";
import * as moment from 'moment';
import {SweetMessagesService} from "../../../../services/sweet-messages.service";
import {ModalController} from "@ionic/angular";
import {CardI} from "../../../../interfaces/cards/card.interface";
import {TarjetaService} from "../../../../services/tarjeta.service";
import {GeneralService} from "../../../../services/general.service";
import {ToastMessageService} from "../../../../services/toast-message.service";

@Component({
  selector: 'app-tarjeta-form',
  templateUrl: './tarjeta-form.component.html',
  styleUrls: ['./tarjeta-form.component.scss'],
})
export class TarjetaFormComponent implements OnInit {

  //@Output() closeModal = new EventEmitter();
  //@Output() submitCard = new EventEmitter();
  //@Input() disableLocations: boolean;
  //@Input() ownerName: string;
  @Input() returnCapture = false;
  // @ViewChild('compInfo') compInfo :

  public cardData: CardI;
  @Input() asModal: boolean;
  @Input() card_id: number;
  @Input() cliente_id: number;
  @Input() loadLoading = true;
  public title = 'Formulario Tarjeta';

  public cardForm: FormGroup;
  public cardConf = CardsConfig;
  public cardConfig: CardConfig;
  public months = Months;
  public validYears: any[];
  public cn1Value = [];
  public saveBtnText = 'Add Card';

  public minValidDate = moment().format('YYYY-MM-DD');

  constructor(
    private formBuilder: FormBuilder,
    private messageService: SweetMessagesService,
    public modalCtrl: ModalController,
    public tarjetaServ: TarjetaService,
    public generalServ: GeneralService,
    private toastServ: ToastMessageService
  ) { }

  ngOnInit() {
    this.initCardForm();

    this.validYears = this.getYears();
    if (this.card_id && this.returnCapture === false) {
      this.loadTarjetaData();
    } else {
      this.fillCardForm();
    }
  }

  private getYears() {
    const years = [];
    const dateStart = moment();
    const dateEnd = moment().add(10, 'y');
    while (dateEnd.diff(dateStart, 'years') >= 0) {
      years.push(dateStart.format('YYYY'));
      dateStart.add(1, 'year');
    }
    return years;
  }

  initCardForm() {
    this.cardForm = this.formBuilder.group({
      c_name: ['', [Validators.required]],
      c_cn1: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      c_cn2: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      c_cn3: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      c_cn4: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      c_month: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      c_year: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      c_code: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      c_type: ['', [Validators.required]],
      c_method: ['']
    });
  }

  async fillCardForm(data?) {
    //this.initCardForm();
    if (!data) {
      this.saveBtnText = 'Add Card';
    } else {
      this.saveBtnText = 'Save Card';
    }
    // await this.getCountries();
    this.cardForm.setValue({
      c_name: data && data.c_name ? data.c_name : null,
      c_cn1: data && data.c_cn1 ? parseInt(data.c_cn1, 10)  : null,
      c_cn2: data && data.c_cn2 ? parseInt(data.c_cn2, 10) : null,
      c_cn3: data && data.c_cn3 ? parseInt(data.c_cn3, 10) : null,
      c_cn4: data && data.c_cn4 ? parseInt(data.c_cn4, 10) : null,
      c_month: data && data.c_month ? data.c_month : null,
      c_year: data && data.c_year ? data.c_year : null,
      c_code: data && data.c_code ? data.c_code : null,
      c_type: data && data.c_type ? data.c_type : null,
      c_method: (data && data.c_method) ? data.c_method : null
    });
  }

  loadTarjetaData() {
    if (this.loadLoading) {
      this.generalServ.presentLoading();
    }
    this.tarjetaServ.getDataById(this.card_id).subscribe(async res => {
      if (this.loadLoading) {
        this.generalServ.dismissLoading();
      }
      if (res.ok === true) {
        this.cardData = res.tarjeta;
        await this.fillCardForm(res.tarjeta);
      }
    }, error => {
      if (this.loadLoading) {
        this.generalServ.dismissLoading();
      }
      console.log(error);
    });
  }

  changeInputMax(value) {
    this.cardConfig = this.cardConf.find((x) => x.desc === value);
    this.cardForm.controls.c_cn4.setValue(null);
    this.cardForm.controls.c_code.setValue(null);

    if (this.cardForm.controls.c_type.value !== 'DINERS CLUB') {
      this.cardForm.controls.c_type.setValue(this.cardConfig.desc);
    }
  }

  // Función para manejar si el usuario da enter y pasar al siguiente input
  keytab(event, _maxLength) {
    // tratamos de predecir que tipo de tarjeta es
    if (event.srcElement.id === 'c_cn1') {
      let cardType: CardConfig[];

      const valueEnter = event.target.value;

      if (!valueEnter) {
        this.cn1Value = [];
      } else {
        const numValue = valueEnter;
        this.cn1Value = [];

        for (let i = 0; i < numValue.length - 1; i++) {
          this.cn1Value[i] = numValue[i];
        }

        this.cn1Value.push(numValue);

        cardType = this.cardConf.filter((x) => {
          const element = x.divine;

          const results = element.filter((n) => {
            for (let i = 0; i < this.cn1Value.length; i++) {
              return n[i].includes(this.cn1Value[i]);
            }
          });
          return results.length;
        });

        if (cardType && cardType.length > 0) {
          this.changeInputMax(cardType[0].desc);
        } else {
          if (this.cardForm.controls.c_type.value !== 'DINERS CLUB') {
            this.cardForm.controls.c_type.setValue(null);
            this.cardForm.controls.c_type.markAsTouched();
          }
        }
      }
    }

    // return;
    if (
      event.srcElement.id === 'c_cn1' &&
      event.target.value.length === _maxLength
    ) {
      document.getElementById('c_cn2').focus();
    }
    if (
      event.srcElement.id === 'c_cn2' &&
      event.target.value.length === _maxLength
    ) {
      document.getElementById('c_cn3').focus();
    }
    if (
      event.srcElement.id === 'c_cn3' &&
      event.target.value.length === _maxLength
    ) {
      document.getElementById('c_cn4').focus();
    }

  }


  //#endregion

  saveUpdate() {

    if (this.cardForm.invalid) {
      this.messageService.printStatus('Review the form, some input are required to procced', 'warning');
      this.cardForm.markAllAsTouched();
      return;
    }
    const cardData = this.cardForm.value;
    const c_number =
      String(cardData.c_cn1) +
      String(cardData.c_cn2) +
      String(cardData.c_cn3) +
      String(cardData.c_cn4);

    const card = {
      id: (this.card_id) ? this.card_id : null,
      c_number,
      c_name: cardData.c_name,
      c_cn1: cardData.c_cn1,
      c_cn2: cardData.c_cn2,
      c_cn3: cardData.c_cn3,
      c_cn4: cardData.c_cn4,
      c_month: cardData.c_month,
      c_year: cardData.c_year,
      c_code: cardData.c_code,
      c_type: cardData.c_type,
      c_method: cardData.c_method,
      c_address: (cardData.c_address) ? cardData.c_address : null,
      c_country: (cardData.c_country) ? cardData.c_country : null,
      c_state: (cardData.c_state) ? cardData.c_state : null,
      c_city: (cardData.c_city) ? cardData.c_city : null,
      c_zip: (cardData.c_zip) ? cardData.c_zip : null,
      cliente_id: (this.cliente_id) ? this.cliente_id : null,
    };


    if (this.loadLoading) {
      this.generalServ.presentLoading('Guardando cambios ...');
    }
    this.tarjetaServ.saveUpdate(card, this.card_id).subscribe(res => {
      if (this.loadLoading) {
        this.generalServ.dismissLoading();
      }

      this.dismiss(true);
      if (res.ok === true) {
        this.card_id = res.card_id;
        card.id = res.card_id;
        if (this.returnCapture == true) {
          this.dismiss(false, card);
        } else {
          this.dismiss(true, null);
        }
        this.toastServ.presentToast('success', res.message, 'top');
      }
    }, error => {
      console.log(error);
      this.messageService.printStatusArray(error.error.errors, 'error');
      if (this.loadLoading) {
        this.generalServ.dismissLoading();
      }
    });
  }

  dismiss(reload?, _data?) {
    this.modalCtrl.dismiss({
      reload,
      info: _data
    });
  }
}
