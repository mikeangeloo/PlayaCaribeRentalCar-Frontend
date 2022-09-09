import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {ActionSheetController, ModalController, NavController} from '@ionic/angular';
import * as moment from 'moment';
import { ReportesService } from 'src/app/services/reportes.service';
import {TxtConv} from '../../../../helpers/txt-conv';
import { ContratoI } from 'src/app/interfaces/contratos/contrato.interface';
import { ContratosStatus } from 'src/app/enums/contratos-status.enum';
var Fraction = require('fractions');

@Component({
  selector: 'app-exedente-kilometraje-gasolina-table',
  templateUrl: './exedente-kilometraje-gasolina-table.component.html',
  styleUrls: ['./exedente-kilometraje-gasolina-table.component.scss'],
})
export class ExedenteKilometrajeGasolinaTableComponent implements OnInit {

  public spinner = false;
  @Input() isModal: boolean;
  displayedColumns: string[] = [
    'fecha',
    'rentador',
    'vehiculo',
    'placas',
    'km_inicial',
    'km_final',
    'km_exedente',
    'gas_inicial',
    'gas_final',
    'gas_exedente',
    'estatus',
  ];
  contratos: ContratoI[];
  listContratos: MatTableDataSource<any>;
  public searchKey: string;
  public statusC = ContratosStatus;
  @ViewChild(MatPaginator, {static: false}) paginator3: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    public reportesServ: ReportesService
  ) { }

  ngOnInit() {
    this.loadContratosTable()
  }

  loadContratosTable() {
    console.log('ready');
    //this.listado-hoteles = null;
    this.listContratos = null;
    this.spinner = true;


    this.reportesServ.getExedenteKilometrajeGasolina().subscribe(response => {
      if (response.ok === true) {
        this.spinner = false;
        this.listContratos = new MatTableDataSource(response.contratos);
        this.listContratos.sort = this.sort;
        this.listContratos.paginator = this.paginator3;
        //this.listContratos = response.contratos;
        this.contratos = response.contratos;
      }
    }, error => {
      this.spinner = false;
      console.log(error);
    });

  }

  public calcExcedenteGas(gas_inicial, gas_final) {
    let resultadoFraccion = Fraction.subtract((gas_final) ? gas_final: "0/8", (gas_inicial) ? gas_inicial: "0/8");
    return resultadoFraccion

  }

  // Method to filter mat-table according to the value enter at input search filter
  applyFilter(event?) {
    const searchValue = event.target.value;
    this.listContratos.filter = TxtConv.txtCon(searchValue, 'lowercase');
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



}
