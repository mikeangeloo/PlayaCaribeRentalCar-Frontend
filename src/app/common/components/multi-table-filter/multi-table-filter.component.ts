import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {ActionSheetController, ModalController, NavController} from "@ionic/angular";
import {SucursalesI} from "../../../interfaces/sucursales.interface";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import * as moment from "moment";
import {TxtConv} from "../../../helpers/txt-conv";
import {SucursalFormComponent} from "../control-accesso/sucursales/sucursal-form/sucursal-form.component";
import {GeneralService} from "../../../services/general.service";
import {SucursalesService} from "../../../services/sucursales.service";
import {SweetMessagesService} from "../../../services/sweet-messages.service";
import {ToastMessageService} from "../../../services/toast-message.service";

@Component({
  selector: 'app-multi-table-filter',
  templateUrl: './multi-table-filter.component.html',
  styleUrls: ['./multi-table-filter.component.scss'],
})
export class MultiTableFilterComponent implements OnInit {

  @Input() asModal: boolean;
  @Input() endpoint: string;
  public title = 'Listado de ';

  public spinner = false;
  public editRow: any;
  @Input() public fullData: [] = [];
  @Input() isModal: boolean;
  @Output() emitData = new EventEmitter();
  displayedColumns: string[] = [];
  columns = [];
  listData: MatTableDataSource<any>;
  public searchKey: string;
  @ViewChild(MatPaginator, {static: false}) paginator3: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    public modalCtrl: ModalController,
    public generalServ: GeneralService,
    public modalCtr: ModalController,
    public navigateCtrl: NavController,
    public actionSheetController: ActionSheetController,
    public sweetServ: SweetMessagesService,
    public toastServ: ToastMessageService
  ) {
  }

  ngOnInit() {
    if (this.endpoint){
      this.title += this.endpoint;
      this.loadDataTable();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    const dataChange = changes.endpoint;
    if (dataChange.isFirstChange() === true || dataChange.firstChange === false) {
      if (this.endpoint){
        this.title += this.endpoint;
        this.loadDataTable();
      }
    }
  }


  // Método para cargar datos de los campus
  loadDataTable() {
    //this.listado-hoteles = null;
    this.listData = null;
    this.spinner = true;

    this.generalServ.getList(this.endpoint).subscribe(response => {
      if (response.ok === true) {
        this.spinner = false;
        this.listData = new MatTableDataSource(response.data);
        this.listData.sort = this.sort;
        this.listData.paginator = this.paginator3;
        this.fullData = response.fullData;
        this.prepareEntriesMap(response.data[0]);
      }
    }, error => {
      this.spinner = false;
      console.log(error);
    });
  }

  prepareEntriesMap(_data) {
    this.displayedColumns = [];
    this.columns = [];

    const _objKeys = Object.keys(_data);
    console.log('map values --->', _objKeys);

    const _newMapping = [];
    _newMapping.push({entry: 'acciones', label: 'ACCIONES'});
    for (let i = 0; i < _objKeys.length; i++) {
      if (_objKeys[i] !== 'id') {
        _newMapping.push({
          entry: _objKeys[i],
          label: TxtConv.txtTransform(_objKeys[i])
        });
      }
    }

    this.columns = _newMapping;

    this.displayedColumns = this.columns.map(c => c.entry);
    console.log(' displayedColumns --->', this.displayedColumns);

  }

  // Method to filter mat-table according to the value enter at input search filter
  applyFilter(event?) {
    const searchValue = event.target.value;
    this.listData.filter = TxtConv.txtCon(searchValue, 'lowercase');
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

  pickSelectedRow(_data) {
    this.sweetServ.confirmRequest('El dato seleccionado es correcto?').then((data) => {
      if (data.value) {
        let _findFullData = this.fullData.find(x => x['id'] === _data.id);
        this.editRow = _findFullData;
        this.dismiss(this.editRow);
      } else {
        this.editRow = null;
      }
    });
  }

  dismiss(data?) {
    this.modalCtrl.dismiss(data);
  }

}
