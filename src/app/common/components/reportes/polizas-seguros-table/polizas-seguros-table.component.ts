import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {ActionSheetController, ModalController, NavController} from '@ionic/angular';
import * as moment from 'moment';
import { VehiculosC, VehiculosI } from 'src/app/interfaces/catalogo-vehiculos/vehiculos.interface';
import { ReportesService } from 'src/app/services/reportes.service';
import {TxtConv} from '../../../../helpers/txt-conv';
import {SearchPayLoadI} from '../../../search-controls/search-controls.component';

@Component({
  selector: 'app-polizas-seguros-table',
  templateUrl: './polizas-seguros-table.component.html',
  styleUrls: ['./polizas-seguros-table.component.scss'],
})
export class PolizasSegurosTableComponent implements OnInit {

  public spinner = false;
  @Input() public vehiculos: VehiculosI[] = [];
  @Input() isModal: boolean;
  @Output() emitData = new EventEmitter();
  displayedColumns: string[] = [
    'no',
    'nombre',
    'placas',
    'aseguradora',
    'no_poliza',
    'tipo_poliza',
    'tel_contacto',
    'titular',
    'desde',
    'hasta',
    'estatus'
  ];
  public vehiculoC = VehiculosC;
  listVehiculos: MatTableDataSource<any>;
  public searchKey: string;
  @ViewChild(MatPaginator, {static: false}) paginator3: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  searchPayload: SearchPayLoadI = {}

  constructor(
    public reportesServ: ReportesService
  ) { }

  ngOnInit() {
    this.loadVehiculosTable()
  }

  // Método para cargar datos de los campus
  loadVehiculosTable(_data?: VehiculosI[], searchPayload?: SearchPayLoadI) {
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
      this.reportesServ.getVehiculosPoliza(searchPayload).subscribe(response => {
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

  public calcEstatus(hasta) {
    var a = moment(hasta);
    var b = moment().subtract(1, 'day');
    let resultado = a.diff(b,'days')
    return resultado

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

  handleSearchFilter(searchPayload: SearchPayLoadI) {
    this.searchPayload = searchPayload
    this.loadVehiculosTable(null, this.searchPayload)
  }

}
