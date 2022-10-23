import {Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { VehiculosI } from 'src/app/interfaces/catalogo-vehiculos/vehiculos.interface';
import { ReportesService } from 'src/app/services/reportes.service';
import {TxtConv} from '../../../../helpers/txt-conv';
import {SearchPayLoadI} from '../../../search-controls/search-controls.component';

export interface DetallePagosI
{
  id: number;
  created_at: string;
  num_contrato: string;
  ub_salida_id: number;
  vehiculo_id: number;
  user_create_id: number;
  user_close_id?: any;
  total_salida: string;
  total_retorno: string;
  cobranza_tarjeta_mxn: any;
  cobranza_tarjeta_usd: any;
  cobranza_efectivo_mxn: string;
  cobranza_efectivo_usd: any;
  cobranza_pre_auth_mxn: string;
  cobranza_pre_auth_usd: any;
  cobranza_deposito_mxn: string;
  cobranza_deposito_usd?: any;
  total_final: number;
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
  usuario_close : {
    id: number;
    username: string;
    nombre: string;
  }
}

@Component({
  selector: 'app-detalles-pagos-table',
  templateUrl: './detalles-pagos-table.component.html',
  styleUrls: ['./detalles-pagos-table.component.scss'],
})
export class DetallesPagosTableComponent implements OnChanges {
  @Input() enterView: boolean;

  public spinner = false;
  displayedColumns: string[] = [
    'fecha',
    'folio',
    'sucursal',
    'placas',
    'nombre_auto',
    'usuario_crea',
    'usuario_cierra',
    //'total_salida',
    //'total_retorno',
    //'total',
    'cobranza_tarjeta_mxn',
    'cobranza_tarjeta_usd',
    'cobranza_efectivo_mxn',
    'cobranza_efectivo_usd',
    'cobranza_pre_auth_mxn',
    'cobranza_pre_auth_usd',
    'cobranza_deposito_mxn',
    'cobranza_deposito_usd'
  ];

  listDetallePagos: MatTableDataSource<DetallePagosI[]>;
  public searchKey: string;
  @ViewChild(MatPaginator, {static: false}) paginator3: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  public totalCobrado = 0;

  searchPayload: SearchPayLoadI = {}

  constructor(
    public reportesServ: ReportesService
  ) { }

  ngOnChanges() {
    this.loadReportePagosTable()
  }

  // Método para cargar datos de los campus
  loadReportePagosTable(searchPayload?: SearchPayLoadI) {
    console.log('ready');
    //this.listado-hoteles = null;
    this.listDetallePagos = null;
    this.spinner = true;

    this.reportesServ.getReportePagos(searchPayload).subscribe(response => {
      if (response.ok === true) {
        this.spinner = false;
        this.listDetallePagos = new MatTableDataSource(response.data);
        this.listDetallePagos.sort = this.sort;
        this.listDetallePagos.paginator = this.paginator3;
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
    this.listDetallePagos.filter = TxtConv.txtCon(searchValue, 'lowercase');
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
    this.loadReportePagosTable(this.searchPayload)
  }

}
