export enum ContratosStatusE
{
  ELIMINADO = 0,
  BORRADOR = 1,
  RESERVADO = 2,
  SALIDA = 3,
  RETORNO = 4
}

export class ContratosStatus
{
  static labelStatus(estatus) {
    switch (estatus) {
      case 0:
        return 'ELIMINADO';
      case 1:
        return 'BORRADOR';
      case 2:
        return 'RESERVADO';
      case 3:
        return 'SALIDA';
      case 4:
        return 'RETORNO';
      default:
        return '--'
    }
  }
}
