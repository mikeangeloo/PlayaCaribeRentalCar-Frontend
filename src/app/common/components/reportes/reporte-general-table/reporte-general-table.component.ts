import {Component, Input, OnChanges, OnInit, ViewChild} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {ReporteDataI} from './interfaces/reporte-data.interface';
import {ReporteEndpointI} from './interfaces/reporte-endpoint.interface';
import {ReportesService} from '../../../../services/reportes.service';
import {ContratosStatus} from '../../../../enums/contratos-status.enum';
import {CobranzaCapturada} from '../../../../interfaces/cobranza/cobranza-capturada.interface';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {TxtConv} from '../../../../helpers/txt-conv';
import {SearchPayLoadI} from '../rentas-por-comisionistas-table/rentas-por-comisionistas-table.component';

@Component({
  selector: 'app-reporte-general-table',
  templateUrl: './reporte-general-table.component.html',
  styleUrls: ['./reporte-general-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class ReporteGeneralTableComponent implements OnInit, OnChanges {
  @Input() enterView: boolean;
  public spinner = false;

  public totalRentados = 0;
  public totalCerrados = 0;
  public totalCancelados = 0;
  public totalReservados = 0;
  public totalBorradores = 0;

  reporteDataEndpoint: ReporteEndpointI[];
  reporteDataSource: ReporteDataI[] = [];
  tableListData: MatTableDataSource<any>
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  public searchKey: string;
  reportColums = [
                    'fecha_renta', 'folio', 'nombre_cliente', 'suc_salida',
                    'agente_entrega', 'agente_recibe', 'suc_entrega', 'vehiculo',
                    'placas', 'km_inicial', 'km_final', 'gas_inicial', 'gas_final',
                    'total', 'total_cobrado', 'fecha_cierre'
                  ];
  columnsToDisplayWithExpand = [...this.reportColums];
  expandedElement: ReporteDataI | null;

  estatusIndicators = [
    {
      indicator: 'Rentado',
      color: ContratosStatus.cssClassStatus(2),
      checked: true,
      status: 2
    },
    {
      indicator: 'Cerrado',
      color: ContratosStatus.cssClassStatus(3),
      checked: true,
      status: 3
    },
    {
      indicator: 'Cancelado',
      color: ContratosStatus.cssClassStatus(0),
      checked: true,
      status: 0
    },
    {
      indicator: 'Reservado',
      color: ContratosStatus.cssClassStatus(4),
      checked: true,
      status: 4
    },
    {
      indicator: 'Borrador',
      color: ContratosStatus.cssClassStatus(1),
      checked: true,
      status: 1
    }
  ]

  searchPayload: SearchPayLoadI = {}

  constructor(
    private reporteServ: ReportesService
  ) { }

  ngOnInit() {
    this.loadReporteGeneral();
  }

  ngOnChanges() {
    if (this.enterView) {
      this.loadReporteGeneral(this.searchPayload)
    }
  }

  loadReporteGeneral(searchPayload?: SearchPayLoadI) {
    this.spinner = true;
    this.tableListData = null;
    this.reporteDataSource = [];
    this.reporteServ.getReporteGeneral(searchPayload).subscribe(res => {
      this.spinner = false;
      if (res.ok) {
        this.reporteDataEndpoint = res.data;
        this.totalRentados = res.total_rentados;
        this.totalCerrados = res.total_cerrados;
        this.totalCancelados = res.total_cancelados;
        this.totalReservados = res.total_reservados;
        this.totalBorradores = res.total_borradores;

        for (let reporte of this.reporteDataEndpoint) {
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
            vehiculoData = reporte.vehiculo?.modelo +  ' ' + reporte.vehiculo?.modelo_ano
          }
          let _report: ReporteDataI = {
            fecha_renta: fechaSalida,
            folio: reporte.num_contrato,
            nombre_cliente: reporte.cliente?.nombre,
            suc_salida: reporte.salida?.alias,
            agente_entrega: reporte.usuario?.nombre,
            agente_recibe: reporte.usuario_close?.nombre,
            suc_entrega: reporte.retorno?.alias,
            vehiculo: vehiculoData,
            placas: reporte.vehiculo?.placas,
            km_inicial: reporte.km_inicial,
            km_final: reporte.km_final,
            gas_inicial: reporte.cant_combustible_salida,
            gas_final: reporte.cant_combustible_retorno,
            total: reporte.total_final,
            total_cobrado: reporte.total_cobrado,
            fecha_cierre: fechaRetorno,
            estatus: reporte.estatus,
            fullData: reporte,
            desgloce_cobranza: reporte.cobranza?.map((cobro) => { return new CobranzaCapturada(cobro)}),
            estatus_color: ContratosStatus.cssClassStatus(reporte.estatus)
          }

          this.reporteDataSource.push(_report);
        }
        this.tableListData = new MatTableDataSource(this.reporteDataSource);
        this.tableListData.sort = this.sort;
        this.tableListData.paginator = this.paginator;


      }
    },error => {
      console.log(error)
    })
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
    this.loadReporteGeneral(this.searchPayload);
  }

  setOnStatusSearch() {
    this.searchPayload.status = this.estatusIndicators.filter((indicator) => indicator.checked).map((indicator) => {
      return indicator.status
    });

    this.loadReporteGeneral(this.searchPayload)
  }

}
