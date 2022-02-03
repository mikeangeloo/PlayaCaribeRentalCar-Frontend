import { Injectable } from '@angular/core';
import {ToastController} from "@ionic/angular";

@Injectable({
  providedIn: 'root'
})
export class ToastMessageService {

  constructor(public toastController: ToastController) { }

  async presentToast(status: 'success' | 'error' | 'warning' | 'info', theMessage, position: 'top' | 'bottom' | 'middle') {
    let color = 'primary';
    switch (status) {
      case 'success':
        color = 'success';
        break;
      case 'error':
        color = 'danger';
        break;
      case 'warning':
        color = 'tertiary';
        break;
      case 'info':
        color = 'secondary';
        break;
    }
    const toast = await this.toastController.create({
      message: theMessage,
      duration: 4000,
      color,
      position
    });
    toast.present();
  }

  async presentToastWithOptions(message) {
    const toast = await this.toastController.create({
      header: 'Importante',
      message: message,
      keyboardClose: false,
      cssClass: 'info-toast',
      position: 'middle',
      buttons: [
         {
          text: 'Entendido',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    await toast.present();

    const { role } = await toast.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }
}
