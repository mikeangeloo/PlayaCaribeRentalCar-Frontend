import {Component, Input, OnChanges, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { ReportesService } from 'src/app/services/reportes.service';
import {TxtConv} from '../../../../helpers/txt-conv';
import {SearchPayLoadI} from '../../../search-controls/search-controls.component';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {ReporteEndpointI} from '../reporte-general-table/interfaces/reporte-endpoint.interface';
import {ReporteDataI} from '../reporte-general-table/interfaces/reporte-data.interface';
import {CobranzaCapturada} from '../../../../interfaces/cobranza/cobranza-capturada.interface';


interface ReportePagosDataI {
  folio: string
  fecha: string
  automovil: string
  folio_cupon: string
  valor_cupon: number
  cobranza_tarjeta_mxn: number
  cobranza_tarjeta_usd: number
  cobranza_efectivo_mxn: number
  cobranza_efectivo_usd: number
  cobranza_pre_auth_mxn: number
  cobranza_pre_auth_usd: number
  cobranza_deposito_mxn: number
  cobranza_deposito_usd: number
  total_cobrado_mxn: number
  total_cobrado_uds: number
  fullData?: ReporteEndpointI
  desgloce_cobranza: CobranzaCapturada[]
}

@Component({
  selector: 'app-detalles-pagos-table',
  templateUrl: './detalles-pagos-table.component.html',
  styleUrls: ['./detalles-pagos-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})


export class DetallesPagosTableComponent implements OnChanges {
  @Input() enterView: boolean;
  public spinner = false;

  public totalCobrado = 0;

  reporteDataEndpoint: ReporteEndpointI[];
  reporteDataSource: ReportePagosDataI[] = [];
  tableListData: MatTableDataSource<any>
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  public searchKey: string;
  reportColums = [
    'folio',
    'fecha',
    'automovil',
    'folio_cupon',
    'cobranza_tarjeta_mxn',
    'cobranza_tarjeta_usd',
    'cobranza_efectivo_mxn',
    'cobranza_efectivo_usd',
    'cobranza_pre_auth_mxn',
    'cobranza_pre_auth_usd',
    'cobranza_deposito_mxn',
    'cobranza_deposito_usd',
    'total_cobrado_mxn',
    'total_cobrado_usd'
  ];
  columnsToDisplayWithExpand = [...this.reportColums];
  expandedElement: ReporteDataI | null;

  searchPayload: SearchPayLoadI = {}

  constructor(
    public reportesServ: ReportesService
  ) { }

  ngOnChanges() {
    if (this.enterView) {
      this.loadReportePagosTable(this.searchPayload)
    }

  }

  // Método para cargar datos de los campus
  loadReportePagosTable(searchPayload?: SearchPayLoadI) {
    this.spinner = true;
    this.tableListData = null;
    this.reporteDataSource = [];

    this.reportesServ.getReportePagos(searchPayload).subscribe(res => {
      this.spinner = false;
      if (res.ok === true) {
        this.reporteDataEndpoint = res.data;

        for(let reporte of this.reporteDataEndpoint) {
          let fechaSalida = '';
          let fechaRetorno = ''
          let vehiculoData = ''
          if (reporte.fecha_salida) {
            fechaSalida = reporte.fecha_salida + ' ' + reporte.hora_salida
          }
          if (reporte.fecha_retorno) {
            fechaRetorno = reporte.fecha_retorno + ' ' + reporte.hora_retorno
          }
          if (reporte.vehiculo_id) {
            vehiculoData = reporte.vehiculo?.modelo +  ' ' + reporte.vehiculo?.placas
          }
          let _report: ReportePagosDataI = {
            automovil: vehiculoData,
            folio_cupon: reporte.folio_cupon,
            valor_cupon: reporte.valor_cupon,
            cobranza_deposito_mxn: reporte.cobranza_deposito_mxn?.total,
            cobranza_deposito_usd: reporte.cobranza_deposito_usd?.total,
            cobranza_efectivo_mxn: reporte.cobranza_efectivo_mxn?.total,
            cobranza_efectivo_usd: reporte.cobranza_efectivo_usd?.total,
            cobranza_pre_auth_mxn: reporte.cobranza_pre_auth_mxn?.total,
            cobranza_pre_auth_usd: reporte.cobranza_pre_auth_usd?.total,
            cobranza_tarjeta_mxn: reporte.cobranza_tarjeta_mxn?.total,
            cobranza_tarjeta_usd: reporte.cobranza_tarjeta_usd?.total,
            fecha: reporte.created_at,
            folio: reporte.num_contrato ?? reporte.num_reserva,
            total_cobrado_mxn: reporte.total_cobrado_mxn,
            total_cobrado_uds: reporte.total_cobrado_usd,
            fullData: reporte,
            desgloce_cobranza: reporte.cobranza?.map((cobro) => { return new CobranzaCapturada(cobro)}),
          }
          this.reporteDataSource.push(_report);
        }


        this.tableListData = new MatTableDataSource(this.reporteDataSource);
        this.tableListData.sort = this.sort;
        this.tableListData.paginator = this.paginator;
        this.totalCobrado = res.total_cobrado;
      }
    }, error => {
      this.spinner = false;
      console.log(error);
    });
  }
  // Method to filter mat-table according to the value enter at input search filter
  applyFilter(event?) {
    const searchValue = event.target.value;
    this.tableListData.filter = TxtConv.txtCon(searchValue, 'lowercase');
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
    this.loadReportePagosTable(this.searchPayload);
  }
}
