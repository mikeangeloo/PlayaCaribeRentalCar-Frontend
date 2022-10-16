import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import * as moment from 'moment-timezone';
import {
  ComisionistasI,
  SearchPayLoadI, UsuariosSistemaI
} from '../components/reportes/rentas-por-comisionistas-table/rentas-por-comisionistas-table.component';
import {DateConv} from '../../helpers/date-conv';

@Component({
  selector: 'app-search-controls',
  templateUrl: './search-controls.component.html',
  styleUrls: ['./search-controls.component.scss'],
})
export class SearchControlsComponent implements OnInit {

  @Input() usuarios: UsuariosSistemaI[];
  @Input() comisionistas: ComisionistasI[];

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });

  selectedUserInter = new FormControl('');
  selectedUserExtern = new FormControl('');

  maxDate = moment().format('YYYY-MM-DD');

  public searchPayload: SearchPayLoadI = {};

  @Output() emitSearchParams = new EventEmitter()

  constructor() { }

  ngOnInit() {}

  searchFilter() {
    if (this.usuarios || this.comisionistas) {
      this.searchPayload.search_users = [];
    } else {
      this.searchPayload.search_users = null;
    }


    let rangeDate = this.range.value;
    let userIntern = this.selectedUserInter.value;
    let userExtern = this.selectedUserExtern.value;

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

    this.emitSearchParams.emit(this.searchPayload);

  }


  clearSearchFilter() {
    this.searchPayload.rango_fechas = null;
    if (this.usuarios || this.comisionistas) {
      this.searchPayload.search_users = [];
    } else {
      this.searchPayload.search_users = null;
    }
    this.range.reset();
    this.selectedUserInter.reset();
    this.selectedUserExtern.reset();

    this.emitSearchParams.emit((this.searchPayload));

  }

}
