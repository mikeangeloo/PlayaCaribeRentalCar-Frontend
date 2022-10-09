import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {ActionSheetController, ModalController, NavController} from '@ionic/angular';
import * as moment from 'moment';
import { VehiculosC, VehiculosI } from 'src/app/interfaces/catalogo-vehiculos/vehiculos.interface';
import { ReportesService } from 'src/app/services/reportes.service';
import {TxtConv} from '../../../../helpers/txt-conv';


@Component({
  selector: 'app-mantenimiento-vehiculos-table',
  templateUrl: './mantenimiento-vehiculos-table.component.html',
  styleUrls: ['./mantenimiento-vehiculos-table.component.scss'],
})
export class MantenimientoVehiculosTableComponent implements OnInit, OnChanges {

  public spinner = false;
  @Input() public vehiculos: VehiculosI[] = [];
  @Input() isModal: boolean;
  @Output() emitData = new EventEmitter();

  @Input() enterView: boolean;
  displayedColumns: string[] = [
    'modelo',
    'placas',
    'km_recorridos',
    'prox_km_servicio',
    'km_faltante',
    'fecha_prox_servicio',
    'dias_faltantes',
    'estatus'
  ];
  public vehiculoC = VehiculosC;
  listVehiculos: MatTableDataSource<any>;
  public searchKey: string;
  @ViewChild(MatPaginator, {static: false}) paginator3: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  dias_faltantes = 0;

  constructor(
    public reportesServ: ReportesService
  ) { }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.enterView) {
      this.loadVehiculosTable()
    }

  }

  // Método para cargar datos de los campus
  loadVehiculosTable(_data?: VehiculosI[]) {
    console.log('ready');
    //this.listado-hoteles = null;
    this.listVehiculos = null;
    this.spinner = true;

    if (_data) {
      this.vehiculos = _data;
      this.spinner = false;
      this.listVehiculos = new MatTableDataSource(_data);
      this.listVehiculos.sort = this.sort;
      this.listVehiculos.paginator = this.paginator3;
    } else {
      this.reportesServ.getMantenimientoVehiculosReport().subscribe(response => {
        if (response.ok === true) {
          this.spinner = false;
          this.listVehiculos = new MatTableDataSource(response.vehiculos);
          this.listVehiculos.sort = this.sort;
          this.listVehiculos.paginator = this.paginator3;
          this.vehiculos = response.vehiculos;
        }
      }, error => {
        this.spinner = false;
        console.log(error);
      });
    }
  }

  // Method to filter mat-table according to the value enter at input search filter
  applyFilter(event?) {
    const searchValue = event.target.value;
    this.listVehiculos.filter = TxtConv.txtCon(searchValue, 'lowercase');
    // this.listSurveys.filter = this.searchKey.trim().toLocaleLowerCase();
    // if (this.dataSource.paginator) {
    //   this.dataSource.paginator.firstPage();
    // }
  }

  // Method to clear input search filter
  onSearchClear() {
    this.searchKey = '';
    this.applyFilter();
  }

  checkDiasFaltantes(checkDate: string) {
    let currDay = moment();
    return moment(checkDate).diff(moment(currDay), 'days');
  }

  checkStatus(km_recorridos: number, prox_km_servicio: number, fecha_prox_servicio: string): {estatus: string, color: string} {
    let diffDays = moment(moment(fecha_prox_servicio)).diff(moment(), 'days');
    let kmRestantes = prox_km_servicio - km_recorridos;

    let limitDays = 14;
    let limitKm = 1000;

    let response = {
      estatus: '',
      color: ''
    }

    if (limitDays >= diffDays && diffDays > 0) {
      response.estatus = 'ALERTA x DÍAS';
      response.color = 'orange';
    } else if (limitKm >= kmRestantes && kmRestantes > 0) {
      response.estatus = 'ALERTA x KM';
      response.color = 'orange';
    } else if (diffDays <= 0) {
      response.estatus = 'URGENTE x DÍAS';
      response.color = 'red';
    } else if (kmRestantes <= 0) {
      response.estatus = 'URGENTE x KM';
      response.color = 'red';
    } else {
      response.estatus = 'AL DÍA';
      response.color = 'green';
    }

    return response
  }

}
