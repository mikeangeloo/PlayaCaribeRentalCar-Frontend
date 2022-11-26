import { Component } from '@angular/core';
import {GeneralService} from '../services/general.service';
import {ReportesService} from '../services/reportes.service';
import * as moment from "moment-timezone";
import {TiposCambioI} from '../interfaces/configuracion/tipos-cambio';
import {combineLatest} from 'rxjs';
import {ConversionMonedaService} from '../services/conversion-moneda.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public fecha: any;
  public tipoCambio: TiposCambioI;

  public totalRentados = 0;
  public totalCerrados = 0;
  public totalCancelados = 0;
  public totalReservados = 0;

  public totalUsuariosActivos = 0;
  public totalComisionistasActivos = 0;

  public vehiculosDisponibles = 0;
  public vehiculosTaller = 0;
  public vehiculosCorralon = 0;

  public loading = false;

  constructor(
    private generalServ: GeneralService,
    private reportesServ: ReportesService,
    private tipoCambioServ: ConversionMonedaService
  ) {
    const momentES = moment().locale('es')
    this.fecha = momentES.format('LL')
  }

  ionViewWillEnter() {
    this.generalServ.headerTitle = 'Dashboard';
    this.loadDashboardInfo();
  }

  loadDashboardInfo() {
    this.generalServ.presentLoading('Cargando dashboard ...');

    combineLatest([
      this.tipoCambioServ.getDataById(),
      this.reportesServ.getReporteGeneral(),
      this.reportesServ.getDashboardInfo()
    ]).subscribe((data: any) => {
      this.tipoCambio = data[0].data;

      this.totalRentados = data[1].total_rentados;
      this.totalCerrados = data[1].total_cerrados;
      this.totalCancelados = data[1].total_cancelados;
      this.totalReservados = data[1].total_reservados;

      this.totalUsuariosActivos = data[2].activeUsers;
      this.totalComisionistasActivos = data[2].activeComisionistas;
      this.vehiculosDisponibles = data[2].vehiculosDisponibles;
      this.vehiculosTaller = data[2].vehiculosTaller;
      this.vehiculosCorralon = data[2].vehiculosCorralon;

      this.generalServ.dismissLoading();
    }, error => {
      console.log(error);
      this.generalServ.dismissLoading();
    })
  }

  ionViewWillLeave() {
    this.generalServ.headerTitle = ''
  }
}
