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
        color = 'secondary';
        break;
      case 'error':
        color = 'danger';
        break;
      case 'warning':
        color = 'tertiary';
        break;
      case 'info':
        color = 'light';
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
}
