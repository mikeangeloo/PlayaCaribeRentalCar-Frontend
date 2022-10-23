import {Component, Input, OnChanges, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { ReportesService } from 'src/app/services/reportes.service';
import {TxtConv} from '../../../../helpers/txt-conv';
import {FormControl, FormGroup} from '@angular/forms';
import {SweetMessagesService} from '../../../../services/sweet-messages.service';
import {DateConv} from '../../../../helpers/date-conv';
import * as moment from 'moment-timezone';
import {SearchPayLoadI} from '../../../search-controls/search-controls.component';

export interface RentasPorComisionaI
{
  id: number;
  created_at: Date;
  fecha_retorno: string;
  num_contrato: string;
  ub_salida_id: number;
  vehiculo_id: number;
  total_dias: number;
  user_create_id: number;
  user_close_id?: any;
  cliente_id: number;
  total_salida: string;
  total_retorno: string;
  rango_fechas: string;
  total_cobrado: number;
  comision: number;
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
    apellidos: string;
  };
  usuario_close?: {
    id: number;
    username: string;
    nombre: string;
    apellidos: string;
  };
  cliente: {
    id: number;
    nombre: string;
  };
}

export interface UsuariosSistemaI {
  id: number;
  username: string;
  nombre: string;
  apellidos: string;
}

export interface ComisionistasI {
  id: number;
  nombre: string;
  apellidos: string;
  comisiones_pactadas?: number[]
}



@Component({
  selector: 'app-rentas-por-comisionistas-table',
  templateUrl: './rentas-por-comisionistas-table.component.html',
  styleUrls: ['./rentas-por-comisionistas-table.component.scss'],
})
export class RentasPorComisionistasTableComponent implements OnChanges {

  @Input() enterView: boolean
  public spinner = false;
  displayedColumns: string[] = [
    'fecha_creacion',
    'fecha_cierre',
    'sucursal',
    'folio',
    'placas',
    'rentador',
    'cliente',
    'dias_renta',
    'total_cobrado'
  ];

  listRentasPorComisionistas: MatTableDataSource<RentasPorComisionaI[]>;
  public searchKey: string;
  @ViewChild(MatPaginator, {static: false}) paginator3: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  public totalCobrado = 0;
  public totalComisiones = 0;

  public porcentaje: number = null
  public comisionCalc: number = null

  public usuarios: UsuariosSistemaI[];
  public comisionistas: ComisionistasI[];

  // range = new FormGroup({
  //   start: new FormControl(),
  //   end: new FormControl()
  // });
  //
  // selectedUserInter = new FormControl('');
  // selectedUserExtern = new FormControl('');
  //
  // maxDate = moment().format('YYYY-MM-DD');
  //
  // public searchPayload: SearchPayLoadI = {};

  constructor(
    public reportesServ: ReportesService,
    public sweetMsg: SweetMessagesService
  ) { }

  ngOnChanges() {
    if (this.enterView) {
      this.loadReporteRentasPorComisionistasTable()
    }

  }

  // Método para cargar datos de los campus
  loadReporteRentasPorComisionistasTable(searchPayload?: SearchPayLoadI) {
    //this.usuariosGroup = [];

    //this.listado-hoteles = null;
    this.listRentasPorComisionistas = null;
    this.spinner = true;

    this.reportesServ.getReporteRentasPorComisionista(searchPayload).subscribe(response => {
      if (response.ok === true) {
        this.spinner = false;
        this.listRentasPorComisionistas = new MatTableDataSource(response.data);
        this.listRentasPorComisionistas.sort = this.sort;
        this.listRentasPorComisionistas.paginator = this.paginator3;
        this.totalCobrado = response.total_cobrado;
        this.totalComisiones = response.total_comisiones;

        if (!searchPayload || !searchPayload?.search_users || searchPayload?.search_users?.length === 0) {
          this.usuarios = response.usuarios_sistema;
          this.comisionistas = response.comisionistas;
        }
      }
    }, error => {
      this.spinner = false;
      console.log(error);
    });
  }
  // Method to filter mat-table according to the value enter at input search filter
  applyFilter(event?) {
    const searchValue = event.target.value;
    this.listRentasPorComisionistas.filter = TxtConv.txtCon(searchValue, 'lowercase');
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

  calcComision() {
    let residuo = (this.totalCobrado * (this.porcentaje / 100))
    this.comisionCalc = (residuo);
  }

  handleSearchFilter(searchPayload: SearchPayLoadI) {

    if (searchPayload.search_users?.find(x => x.tipo === 'comisionistas')) {
      if(this.displayedColumns.findIndex(x => x === 'total_comision') === -1) {
        this.displayedColumns.push('total_comision');
      }
      if(this.displayedColumns.findIndex(x => x === 'comisionista') === -1) {
        this.displayedColumns.push('comisionista');
      }
    }

    if (searchPayload.search_users?.length === 0 || !searchPayload.rango_fechas) {
      this.clearSearchFilter()
    } else {
      this.loadReporteRentasPorComisionistasTable(searchPayload);
    }

  }

  clearSearchFilter() {
    // this.searchPayload.rango_fechas = null;
    // this.searchPayload.search_users = [];
    // this.range.reset();
    // this.selectedUserInter.reset();
    // this.selectedUserExtern.reset();
    this.loadReporteRentasPorComisionistasTable();

    let findIndexTotalComision = this.displayedColumns.findIndex(x => x === 'total_comision');


    if (findIndexTotalComision !== -1) {
      this.displayedColumns.splice(findIndexTotalComision, 1);
    }

    let findIndexComisionista = this.displayedColumns.findIndex(x => x === 'comisionista');

    if (findIndexComisionista !== -1) {
      this.displayedColumns.splice(findIndexComisionista, 1);
    }

  }

}
