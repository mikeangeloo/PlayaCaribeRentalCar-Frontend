import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import * as moment from 'moment-timezone';
import {
  ComisionistasI,
  UsuariosSistemaI
} from '../components/reportes/rentas-por-comisionistas-table/rentas-por-comisionistas-table.component';
import {DateConv} from '../../helpers/date-conv';
import {VehiculosI} from '../../interfaces/catalogo-vehiculos/vehiculos.interface';
import {VehiculosService} from '../../services/vehiculos.service';


export interface SearchPayLoadI {
  rango_fechas?: {
    start: string;
    end: string
  },
  search_users?:
    {
      tipo?: string;
      user_id?: number
    }[],
  status?: Array<number>
  vehiculoId?: number
  num_contrato?: string
}

@Component({
  selector: 'app-search-controls',
  templateUrl: './search-controls.component.html',
  styleUrls: ['./search-controls.component.scss'],
})
export class SearchControlsComponent implements OnInit {

  @Input() usuarios: UsuariosSistemaI[];
  @Input() comisionistas: ComisionistasI[];



  @Input() byVehiculos: boolean = false;
  @Input() byVehiculoParam: string;
  @Input() byNumContrato: boolean = false;

  public vehiculos: VehiculosI[];

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });

  selectedVehiculo = new FormControl('');
  selectedUserInter = new FormControl('');
  selectedUserExtern = new FormControl('');
  selectedNumContrato = new FormControl('');

  maxDate = moment().format('YYYY-MM-DD');

  public searchPayload: SearchPayLoadI = {};

  @Output() emitSearchParams = new EventEmitter()

  constructor(
    private vehiculosServ: VehiculosService
  ) { }

  ngOnInit() {
    if (this.byVehiculos) {
      this.loadVehiculosData();
    }
  }

  loadVehiculosData() {
    this.vehiculosServ.getAll().subscribe(response => {
      if (response.ok) {
        this.vehiculos = response.vehiculos;
      }
    }, error1 => {
      console.log(error1);
    })
  }

  searchFilter() {
    if (this.usuarios || this.comisionistas) {
      this.searchPayload.search_users = [];
    } else {
      this.searchPayload.search_users = null;
    }


    let rangeDate = this.range.value;
    let userIntern = this.selectedUserInter.value;
    let userExtern = this.selectedUserExtern.value;
    let vehiculoId = this.selectedVehiculo.value;
    let numContrato = this.selectedNumContrato.value;

    if (rangeDate) {
      if (moment(rangeDate.start).isValid()) {
        rangeDate.start = DateConv.transFormDate(rangeDate.start, 'regular');
      } else {
        rangeDate.start = null;
      }

      if (moment(rangeDate.end).isValid()) {
        rangeDate.end = DateConv.transFormDate(rangeDate.end, 'regular');
      } else {
        rangeDate.start = null;
      }

      if (rangeDate.end || rangeDate.start) {
        this.searchPayload.rango_fechas = rangeDate;
      }
    }

    if (userIntern) {
      this.searchPayload.search_users.push({
        tipo: 'usuarios',
        user_id: userIntern
      })
    }

    if (userExtern) {
      this.searchPayload.search_users.push({
        tipo: 'comisionistas',
        user_id: userExtern
      });
    }

    if (vehiculoId) {
      this.searchPayload.vehiculoId = vehiculoId
    }

    if (numContrato) {
      this.searchPayload.num_contrato = numContrato;
    }

    this.emitSearchParams.emit(this.searchPayload);

  }


  clearSearchFilter() {
    this.searchPayload.rango_fechas = null;
    if (this.usuarios || this.comisionistas) {
      this.searchPayload.search_users = [];
    } else {
      this.searchPayload.search_users = null;
    }
    this.searchPayload.vehiculoId = null;
    this.searchPayload.num_contrato = null;

    this.range.reset();
    this.selectedUserInter.reset();
    this.selectedUserExtern.reset();
    this.selectedVehiculo.reset();
    this.selectedNumContrato.reset();

    this.emitSearchParams.emit((this.searchPayload));

  }

}
