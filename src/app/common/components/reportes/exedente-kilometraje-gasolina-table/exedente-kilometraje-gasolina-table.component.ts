import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { ReportesService } from 'src/app/services/reportes.service';
import {TxtConv} from '../../../../helpers/txt-conv';
import { ContratoI } from 'src/app/interfaces/contratos/contrato.interface';
import { ContratosStatus } from 'src/app/enums/contratos-status.enum';
import {VehiculosI} from '../../../../interfaces/catalogo-vehiculos/vehiculos.interface';
import {SearchPayLoadI} from '../../../search-controls/search-controls.component';
import Fraction from 'fractions'

interface ReporteExcedenteKMGasI {
  fecha: Date,
  rentador: string,
  vehiculo: string,
  placas: string,
  km_inicial: number,
  km_final: number,
  km_exedente: number,
  gas_inicial: string,
  gas_final: string,
  gas_exedente: string,
  estatus: string,
}

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
  reporteContratos: ReporteExcedenteKMGasI[] = [];

  listContratos: MatTableDataSource<any>;
  public searchKey: string;
  public statusC = ContratosStatus;
  @ViewChild(MatPaginator, {static: false}) paginator3: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  searchPayload: SearchPayLoadI = {}

  constructor(
    public reportesServ: ReportesService
  ) { }

  ngOnInit() {
    this.loadContratosTable()
  }

  loadContratosTable(searchPayload?: SearchPayLoadI) {
    console.log('ready');
    //this.listado-hoteles = null;
    this.listContratos = null;
    this.spinner = true;
    this.reporteContratos = [];


    this.reportesServ.getExedenteKilometrajeGasolina(searchPayload).subscribe(response => {
      if (response.ok === true) {
        this.spinner = false;
        this.contratos = response.contratos;

        for (let contrato of this.contratos) {
          let reporte: ReporteExcedenteKMGasI = {
            estatus: 'CONTRATO ' + ContratosStatus.labelStatus(contrato.estatus),
            fecha: contrato.created_at,
            gas_exedente: this.calcExcedenteGas(contrato.cant_combustible_salida ,contrato.cant_combustible_retorno),
            gas_final: contrato.cant_combustible_retorno,
            gas_inicial: contrato.cant_combustible_salida,
            km_exedente: contrato.km_final - contrato.km_inicial,
            km_final: contrato.km_final,
            km_inicial: contrato.km_inicial,
            placas: contrato.vehiculo?.placas,
            rentador: contrato.usuario?.nombre,
            vehiculo: contrato.vehiculo?.modelo
          }

          this.reporteContratos.push(reporte);
        }

        this.listContratos = new MatTableDataSource(this.reporteContratos);
        this.listContratos.sort = this.sort;
        this.listContratos.paginator = this.paginator3;
        //this.listContratos = response.contratos;

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

  handleSearchFilter(searchPayload: SearchPayLoadI) {
    this.searchPayload = searchPayload
    this.loadContratosTable(this.searchPayload)
  }

}
