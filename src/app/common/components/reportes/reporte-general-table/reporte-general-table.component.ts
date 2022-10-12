import {Component, Input, OnInit} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {ReporteDataI} from './interfaces/reporte-data.interface';
import {ReporteEndpointI} from './interfaces/reporte-endpoint.interface';
import {ReportesService} from '../../../../services/reportes.service';

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

export class ReporteGeneralTableComponent implements OnInit {
  @Input() enterView: boolean;

  public totalCobrado = 0;
  reporteDataEndpoint: ReporteEndpointI[];
  dataSource: ReporteDataI[] = [];
  reportColums = [
                    'fecha_renta', 'folio', 'nombre_cliente', 'suc_salida',
                    'agente_entrega', 'agente_recibe', 'suc_entrega', 'vehiculo',
                    'placas', 'km_inicial', 'km_final', 'gas_inicial', 'gas_final',
                    'total', 'total_cobrado', 'fecha_cierre'
                  ];
  columnsToDisplayWithExpand = [...this.reportColums];
  expandedElement: ReporteDataI | null;

  constructor(
    private reporteServ: ReportesService
  ) { }

  ngOnInit() {
    this.loadReporteGeneral();
  }

  loadReporteGeneral() {
    this.dataSource = [];
    this.reporteServ.getReporteGeneral().subscribe(res => {
      if (res.ok) {
        this.reporteDataEndpoint = res.data;
        this.totalCobrado = res.total_cobrado;

        for (let reporte of this.reporteDataEndpoint) {
          let _report: ReporteDataI = {
            fecha_renta: reporte.fecha_salida + ' ' + reporte.hora_salida,
            folio: reporte.num_contrato,
            nombre_cliente: reporte.cliente?.nombre,
            suc_salida: reporte.salida?.alias,
            agente_entrega: reporte.usuario?.nombre,
            agente_recibe: reporte.usuario_close?.nombre,
            suc_entrega: reporte.retorno?.alias,
            vehiculo: reporte.vehiculo?.modelo +  ' ' + reporte.vehiculo?.modelo_ano,
            placas: reporte.vehiculo?.placas,
            km_inicial: reporte.km_inicial,
            km_final: reporte.km_final,
            gas_inicial: reporte.cant_combustible_salida,
            gas_final: reporte.cant_combustible_retorno,
            total: reporte.total_final,
            total_cobrado: reporte.total_cobrado,
            fecha_cierre: reporte.fecha_retorno + ' ' + reporte.hora_retorno
          }

          this.dataSource.push(_report);
        }
        console.log('data source', this.dataSource)
      }
    },error => {
      console.log(error)
    })
  }

}
