import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SweetMessagesService {

   //#region Atributos
   message: any;
   status: string;
   deletePopOup: any;
   //#endregion

   //#region Métodos

  // Función para imprimir los mensajes de retroalimentación del backend o errores de aplicación, incluye una bandera por si es mensaje de status de envio de un correo
  printStatus(message: any, status: string, mailed?: boolean) {
    this.message = message;
    this.status = status;

    if (this.status === 'success') {
      Swal.fire({
        html: '' + this.message,
        icon: this.status,
        showConfirmButton: false,
        timer: mailed ? 4000 : 2500,
        heightAuto: false
      });

    } else if (this.status === 'error') {
      Swal.fire({
        html: '' + this.message,
        icon: this.status,
        timer: 5000,
        heightAuto: false
      });
    } else if (this.status === 'warning') {
      Swal.fire({
        html: '' + this.message,
        icon: this.status,
        timer: 4000,
        heightAuto: false
      });
    }
  }

  printNotification(title: string, message: string) {
    Swal.fire({
      title: title,
      html: message,
      // icon: 'info',
      showConfirmButton: true,
      heightAuto: false,
      position: 'top'
    });
  }
  printStatusArray(message: [], status: string, mailed?: boolean) {
    let msg;
    for (let i = 0; i < message.length; i ++) {
      msg = message[i] + '<br>';
    }
    this.status = status;

    if (this.status === 'success') {
      Swal.fire({
        html: '' + msg,
        icon: this.status,
        showConfirmButton: false,
        timer: mailed ? 4000 : 2500,
        heightAuto: false,
      });

    } else if (this.status === 'error') {
      Swal.fire({
        html: '' + msg,
        icon: this.status,
        //showCloseButton: true,
        heightAuto: false,
        timer: 5000
      });
    } else if (this.status === 'warning') {
      Swal.fire({
        html: '' + msg,
        icon: this.status,
        timer: 4000,
        heightAuto: false,
      });
    }
  }

  // Función para preguntar al usuario si desea continuar, con mensaje configurable
  confirmRequest(msg?, extraTxt?: string, confirmBtnText?, cancelBtnText?, ) {
    this.deletePopOup = Swal.fire({
      title: msg ? msg : '¿Estas seguro de proceder?',
      text: extraTxt ? extraTxt : 'Esta acción no se podrá deshacer',
      icon: 'warning',
      showCancelButton: true,
      focusCancel: true,
      showConfirmButton: true,
      confirmButtonText: confirmBtnText ? confirmBtnText : 'Continuar',
      cancelButtonText: cancelBtnText ? cancelBtnText : 'Descartar',
      confirmButtonColor: 'var(--ion-color-success)',
      heightAuto: false,
    });
    return this.deletePopOup;
  }

  async confirmContactTel(tel) {
   return await Swal.fire({
      title: 'Confirma el número teléfonico para contactarte',
      input: 'text',
      inputLabel: 'Teléfono',
      inputValue: tel,
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      heightAuto: false,
      inputValidator: (value) => {
        if (!value) {
          return 'Debes indicar tu número teléfonico'
        }
      }
    });
  }

  async confirmRecoveryEmail() {
    return await Swal.fire({
       title: 'Confirma tu correo electrónico para enviarte un código de recuperación',
       input: 'text',
       inputLabel: 'Correo Electrónico',
       showCancelButton: true,
       cancelButtonText: 'Cancelar',
       heightAuto: false,
       inputValidator: (value) => {
         if (!value) {
           return 'Debes indicar tu correo electrónico'
         }
       }
     });
   }

  // Función para preguntar al usuario se desea continuar con la eliminación de un elemento
  confirmRemove() {
    this.deletePopOup = Swal.fire( {
      title: '¿Estás seguro de que quieres eliminar este artículo?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      focusCancel: true,
      confirmButtonText: 'Remover',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#ce3600',
      heightAuto: false,
    });
    return this.deletePopOup;
  }

  // Función para notificar que fue cancelada la acción
  dismissRemove() {
    this.deletePopOup = Swal.fire({
      title: 'Cancelado',
      text: 'Tu información está segura :), acción cancelada',
      icon: 'info',
      timer: 1000,
      heightAuto: false,
    });
    return this.deletePopOup;
  }


  dismissAction() {
    this.deletePopOup = Swal.fire({
      title: 'Cancelado',
      text: 'Acción cancelada',
      icon: 'info',
      timer: 1000,
      heightAuto: false,
    });
    return this.deletePopOup;
  }

  // Función para preguntar al usuario si desea continuar con la eliminación de un elemento
  confirmDelete() {
    this.deletePopOup = Swal.fire({
      title: '¿Estás seguro de que quieres eliminar esta información?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      focusCancel: true,
      confirmButtonText: 'Borrar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#b20909',
      heightAuto: false,
    });
    return this.deletePopOup;
  }

  // Función para mostrar mensaje de cancelación de acción
  dismissDelete() {
    this.deletePopOup = Swal.fire({
      title: 'Acción Cancelada',
      text: 'No se aplicaron cambios',
      icon: 'info',
      timer: 1500,
      heightAuto: false,
    });
    return this.deletePopOup;
  }
  // endregion
  constructor() { }
}
