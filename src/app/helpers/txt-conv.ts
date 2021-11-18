import {ToastMessageService} from '../services/toast-message.service';

export class TxtConv {


  // Función para convertir cadena de texto en mayusculas o minusculas limpiando espacios
  public static  txtCon(data: string, convertion: 'uppercase' | 'lowercase') {
    // expresion para identifiar y sustituir data string
    const regex = /_|-|\s/g;
    let transform;
    transform = data.replace(regex, '');
    if (convertion === 'uppercase') {
      transform = transform.toUpperCase();
    }
    if (convertion === 'lowercase') {
      transform = transform.toLowerCase();
    }
    return transform;
  }

  public static txtTransform(data: string): string {
    const regex = /_|-/g;
    let transform;
    transform = data.replace(regex, ' ');
    return transform.toUpperCase();
  }

  public static addZerosConv(data: number, add?: number) {
    const _add = (add) ? add : 4;
    return String(data).padStart(_add, '0');
  }
}
