import {Component, Input, OnChanges, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { ReportesService } from 'src/app/services/reportes.service';
import {TxtConv} from '../../../../helpers/txt-conv';
import {SearchPayLoadI} from '../../../search-controls/search-controls.component';

export interface RentasPorVehiculoI
{
  id: number;
  created_at: Date;
  num_contrato: string;
  ub_salida_id: number;
  vehiculo_id: number;
  user_create_id: number;
  user_close_id?: any;
  total_salida: string;
  total_retorno: string;
  rango_fechas: string;
  total_cobrado: number;
  salida: {
    id: number;
    alias: string;
  };
  vehiculo: {
    id: number;
    modelo: string;
    modelo_ano: string;
    placas: string;
    color: string;
  };
  usuario: {
    id: number;
    username: string;
    nombre: string;
  };
  usuario_close?: {
    id: number;
    username: string;
    nombre: string;
  };
}

@Component({
  selector: 'app-rentas-por-vehiculo-table',
  templateUrl: './rentas-por-vehiculo-table.component.html',
  styleUrls: ['./rentas-por-vehiculo-table.component.scss'],
})
export class RentasPorVehiculoTableComponent implements OnChanges {

  @Input() enterView: boolean
  public spinner = false;
  displayedColumns: string[] = [
    'created_at',
    'sucursal',
    'folio',
    'placas',
    'total_cobrado'
  ];

  listRentasPorVehiculo: MatTableDataSource<RentasPorVehiculoI[]>;
  public searchKey: string;
  @ViewChild(MatPaginator, {static: false}) paginator3: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  public totalCobrado = 0;

  searchPayload: SearchPayLoadI = {}

  constructor(
    public reportesServ: ReportesService
  ) { }

  ngOnChanges() {
    if (this.enterView) {
      this.loadReporteRentasPorVehiculoTable()
    }
  }

  // Método para cargar datos de los campus
  loadReporteRentasPorVehiculoTable(searchPayload?: SearchPayLoadI) {
    console.log('ready');
    //this.listado-hoteles = null;
    this.listRentasPorVehiculo = null;
    this.spinner = true;

    this.reportesServ.getReporteRentasPorVehiculo(searchPayload).subscribe(response => {
      if (response.ok === true) {
        this.spinner = false;
        this.listRentasPorVehiculo = new MatTableDataSource(response.data);
        this.listRentasPorVehiculo.sort = this.sort;
        this.listRentasPorVehiculo.paginator = this.paginator3;
        this.totalCobrado = response.total_cobrado;
      }
    }, error => {
      this.spinner = false;
      console.log(error);
    });
  }
  // Method to filter mat-table according to the value enter at input search filter
  applyFilter(event?) {
    const searchValue = event.target.value;
    this.listRentasPorVehiculo.filter = TxtConv.txtCon(searchValue, 'lowercase');
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
    this.loadReporteRentasPorVehiculoTable(this.searchPayload)
  }

}
