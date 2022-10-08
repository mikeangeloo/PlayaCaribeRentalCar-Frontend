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
  cliente: {
    id: number;
    nombre: string;
  };
}

export interface UsuariosSistemaI {
  id: number;
  username: string;
  nombre: string
}

export interface ComisionistasI {
  id: number;
  nombre: string;
  apellidos: string;
  comisiones_pactadas?: number[]
}

export interface UserGroupI {
  group: string
  disabled?: boolean;
  user: UsuariosSistemaI[] | ComisionistasI[]
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

  public porcentaje: number = null
  public comisionCalc: number = null

  public usuarios: UsuariosSistemaI[];
  public comisionistas: ComisionistasI[];
  public usuariosGroup: UserGroupI[] = []

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });

  selectedUserGroup = new FormControl('');

  maxDate = moment().format('YYYY-MM-DD');

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
  loadReporteRentasPorComisionistasTable(payload?) {
    this.usuariosGroup = [];
    console.log('ready');
    //this.listado-hoteles = null;
    this.listRentasPorComisionistas = null;
    this.spinner = true;

    this.reportesServ.getReporteRentasPorComisionista(payload).subscribe(response => {
      if (response.ok === true) {
        this.spinner = false;
        this.listRentasPorComisionistas = new MatTableDataSource(response.data);
        this.listRentasPorComisionistas.sort = this.sort;
        this.listRentasPorComisionistas.paginator = this.paginator3;
        this.totalCobrado = response.total_cobrado;
        this.usuarios = response.usuarios_sistema;
        this.comisionistas = response.comisionistas;
        this.usuariosGroup.push({
          group: 'usuarios',
          user: this.usuarios
        });

        this.usuariosGroup.push({
          group: 'comisionistas',
          user: this.comisionistas
        });

        console.log('usuario group --->', this.usuariosGroup)
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

  searchFilter() {
    let payload = {
      rango_fechas: null,
      usuario_data: null
    }
    let rangeDate = this.range.value;
    let userSearch = this.selectedUserGroup.value;

    if (rangeDate) {
      rangeDate.start = DateConv.transFormDate(rangeDate.start, 'regular');
      rangeDate.end = DateConv.transFormDate(rangeDate.end, 'regular');
      payload.rango_fechas = rangeDate;
    }

    if (userSearch) {
      payload.usuario_data = userSearch
    }

    console.log('payload --->', payload);

    this.loadReporteRentasPorComisionistasTable(payload);

  }

}
