import { Component, OnInit } from '@angular/core';
import {NgxMaterialTimepickerTheme} from "ngx-material-timepicker";
import {Months} from "../../../interfaces/shared/months";
import * as moment from "moment";
import {ImgDataTranferI} from "../../../interfaces/shared/img-data-tranfer.interface";
import {SweetMessagesService} from "../../../services/sweet-messages.service";
import {CardI} from "../../../interfaces/cards/card.interface";
import {TarjetaFormComponent} from "../../../common/components/tarjetas/tarjeta-form/tarjeta-form.component";
import {ModalController} from "@ionic/angular";

@Component({
  selector: 'app-contrato',
  templateUrl: './contrato.page.html',
  styleUrls: ['./contrato.page.scss'],
})
export class ContratoPage implements OnInit {

  step = 0;
  public months = Months;
  public validYears: any[];
  fileImg: File;
  fileImgUrl: string;
  public signature = '';

  public imgDatasTranfer: ImgDataTranferI[] = [];

  apolloThemClock: NgxMaterialTimepickerTheme = {
    container: {
      bodyBackgroundColor: '#f5c588',
      buttonColor: '#fff'
    },
    dial: {
      dialBackgroundColor: '#f09d28',
    },
    clockFace: {
      clockFaceBackgroundColor: '#f09d28',
      clockHandColor: '#222428',
      clockFaceTimeInactiveColor: '#fff'
    }
  };

  constructor(
    public sweetMsgServ: SweetMessagesService,
    public modalCtr: ModalController,
  ) { }

  ngOnInit() {
    this.validYears = this.getYears();
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


  setStep(index: number) {
    this.step = index;
  }

  async nextStep() {
    this.step++;
  }

  async prevStep() {
    this.step--;
  }

  processDataImage(event: {imgUrl: string, image: File}) {
    this.fileImg = event.image;
    this.fileImgUrl = event.imgUrl;

    this.imgDatasTranfer.push({
      file: event.image,
      url: event.imgUrl,
      uploading: false
    });
  }

  uploadArrayDatasImg() {
    if (this.imgDatasTranfer.length === 0) {
      this.sweetMsgServ.printStatus('Debe adjuntar una imagen', 'warning');
      return;
    }

    this.sweetMsgServ.printStatus('Función en desarrollo', 'warning');
    return;

    /*this.sweetMsgServ.confirmRequest().then(async (data) => {
      if (data.value) {

        console.log('here');
        let _lastServError = null;
        for (let i = 0; i< this.bodyImgData.length; i++) {
          console.log('sending info---->');
          const formData = new FormData();
          formData.append('image', this.bodyImgData[i].file, this.bodyImgData[i].file.name);
          this.bodyImgData[i].uploading = true;

          let res = await this.bodyServ.uploadBodyPost(formData);

          if (res.ok === true) {
            this.bodyImgData[i].uploadOk = true;
            this.bodyImgData[i].uploading = false;
          } else {
            this.bodyImgData[i].uploadOk = false;
            this.bodyImgData[i].uploading = false;

            _lastServError = res.data.error.errors;
          }
        }

        let successTotal = 0;
        for (let j = 0; j < this.bodyImgData.length; j++) {
          if (this.bodyImgData[j].uploadOk === true) {
            successTotal ++;
          }
        }
        if (successTotal === this.bodyImgData.length) {
          console.log('all saved');
          this.sweetMsgServ.printStatus('Se han guardado sus imagenes de manera correcta', 'success');
          this.resetAll();
          this.navigate.navigateRoot(['/mi-historia']);
        } else {
          console.log('error', _lastServError);
          if (_lastServError) {
            this.sweetMsgServ.printStatusArray(_lastServError, 'error');
            setTimeout(() => {
              this.resetAll();
              this.navigate.navigateRoot(['/mi-historia']);
            }, 2000);
          } else {
            this.sweetMsgServ.printStatus('Se produjo un error al guardar una de sus imagenes, intentelo nuevamente o eliminela de la cola', 'error');
          }
        }
      }
    });*/
  }

  removeImg(index) {
    this.imgDatasTranfer.splice(index, 1);
  }

  async openTarjetaForm(_data?: CardI) {
    //const pageEl: HTMLElement = document.querySelector('.ion-page');
    //this.generalService.presentLoading();
    const modal = await this.modalCtr.create({
      component: TarjetaFormComponent,
      componentProps: {
        'asModal': true,
        'justCapture': true
      },
      swipeToClose: true,
      cssClass: 'edit-form',
      //presentingElement: pageEl
    });
    await modal.present();
    const {data} = await modal.onWillDismiss();
    if (data.reload && data.reload === true) {
      //this.loadClienteData();
    }
  }

  captureSignature(e){
    this.signature = e;
  }


  resetAll() {
    this.fileImg =  null;
    this.fileImgUrl =  null;
    this.imgDatasTranfer = [];
  }

}
