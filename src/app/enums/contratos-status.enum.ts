export enum ContratosStatusE
{
  ELIMINADO = 0,
  BORRADOR = 1,
  RENTADO = 2,
  CERRADO = 3,
  RESERVA= 4
}

export class ContratosStatus
{
  static labelStatus(estatus) {
    switch (estatus) {
      case 0:
        return 'CANCELADO';
      case 1:
        return 'BORRADOR';
      case 2:
        return 'RENTADO';
      case 3:
        return 'CERRADO';
      case 4:
        return 'RESERVA';
      default:
        return '--'
    }
  }
}
