import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {EmpresasI} from "../../../../interfaces/Empresas.interface";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {GeneralService} from "../../../../services/general.service";
import {EmpresasService} from "../../../../services/empresas.service";
import {ActionSheetController, ModalController, NavController} from "@ionic/angular";
import * as moment from 'moment';
import {TxtConv} from "../../../../helpers/txt-conv";
import {EmpresaFormComponent} from "../empresa-form/empresa-form.component";
import {SweetMessagesService} from "../../../../services/sweet-messages.service";
import {ToastMessageService} from "../../../../services/toast-message.service";
import {error} from "protractor";

@Component({
  selector: 'app-empresas-list',
  templateUrl: './empresas-list.component.html',
  styleUrls: ['./empresas-list.component.scss'],
})
export class EmpresasListComponent implements OnInit, OnChanges {

  public spinner = false;
  public editEmpresa: EmpresasI;
  @Input() public empresas: EmpresasI[] = [];
  @Input() isModal: boolean;
  @Output() emitData = new EventEmitter();
  displayedColumns: string[] = [
    'id',
    'nombre',
    'rfc',
    'direccion',
    'tel_contacto',
    'activo',
    'created_at',
    'acciones'
  ];
  listEmpresas: MatTableDataSource<any>;
  public searchKey: string;
  @ViewChild(MatPaginator, {static: false}) paginator3: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;



  constructor(
    public generalService: GeneralService,
    public empresasService: EmpresasService,
    public modalCtr: ModalController,
    public navigateCtrl: NavController,
    public actionSheetController: ActionSheetController,
    public sweetServ: SweetMessagesService,
    public toastServ: ToastMessageService
  ) {
    //this.loadSurveysTable();
    this.initEmpresas();
  }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    const empresasChange = changes.empresas;
    if (empresasChange.isFirstChange() === true || empresasChange.firstChange === false) {
      if (this.empresas) {
        console.log('array');
        this.loadEmpresasTable(this.empresas);
      } else {
        this.loadEmpresasTable();
      }
    }
  }

  initEmpresas() {
    const currDate = moment().format('YYYY-MM-DD');
    this.editEmpresa = {
      id: 0,
    };
  }

  // Método para cargar datos de los campus
  loadEmpresasTable(_empresa?: EmpresasI[]) {
    //this.empresas = null;
    this.listEmpresas = null;
    this.initEmpresas();
    this.spinner = true;

    if (_empresa) {
      this.empresas = _empresa;
      this.spinner = false;
      this.listEmpresas = new MatTableDataSource(_empresa);
      this.listEmpresas.sort = this.sort;
      this.listEmpresas.paginator = this.paginator3;
    } else {
      this.empresasService.getAll().subscribe(response => {
        if (response.ok === true) {
          this.spinner = false;
          this.listEmpresas = new MatTableDataSource(response.empresas);
          this.listEmpresas.sort = this.sort;
          this.listEmpresas.paginator = this.paginator3;
          this.empresas = response.empresas;
        }
      }, error => {
        this.spinner = false;
        console.log(error);
      });
    }
  }

  // Method to filter mat-table according to the value enter at input search filter
  applyFilter(event?) {
    const searchValue = event.target.value;
    this.listEmpresas.filter = TxtConv.txtCon(searchValue, 'lowercase');
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

  catchSelectedRow(_empresa: EmpresasI) {
    this.editEmpresa = _empresa;
  }
  // Método para editar survey
  async openEmpresaForm(_empresa?: EmpresasI) {
    if (_empresa) {
      this.editEmpresa = _empresa;
    } else {
      this.initEmpresas();
    }
    //this.generalService.presentLoading();
    const modal = await this.modalCtr.create({
      component: EmpresaFormComponent,
      componentProps: {
        'asModal': true,
        'empresa_id': (_empresa && _empresa.id) ? _empresa.id : null
      },
      swipeToClose: true,
      cssClass: 'edit-form'
    });
    await modal.present();
    const {data} = await modal.onWillDismiss();
    if (data.reload && data.reload === true) {
      this.loadEmpresasTable();
    }
  }

  inactiveEmpresa(empresa: EmpresasI) {
    this.sweetServ.confirmRequest('¿Estás seguro de querer deshabilitar este registro ?').then((data) => {
      if (data.value) {
        this.empresasService.setInactive(empresa.id).subscribe(res => {
          if (res.ok === true) {
            this.toastServ.presentToast('success', res.message, 'top');
            this.loadEmpresasTable();
          }
        }, error => {
          console.log(error);
          this.sweetServ.printStatusArray(error.error.errors, 'error');
        });
      }
    });
  }

  activeEmpresa(empresa: EmpresasI) {
    this.sweetServ.confirmRequest('¿Estás seguro de querer habilitar este registro ?').then((data) => {
      if (data.value) {
        this.empresasService.setEnable(empresa.id).subscribe(res => {
          if (res.ok === true) {
            this.toastServ.presentToast('success', res.message, 'top');
            this.loadEmpresasTable();
          }
        }, error => {
          console.log(error);
          this.sweetServ.printStatusArray(error.error.errors, 'error');
        });
      }
    });
  }


  async editAction(_empresa: EmpresasI) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Actions',
      cssClass: 'my-custom-class',
      buttons: [
        {
          text: 'Continue Editing',
          icon: 'create',
          role: 'edit',
          handler: () => {
            console.log('Edit clicked');
            //this.navigateCtrl.navigateRoot([`/sales-survey/new/${_empresa.idsurvey}`]);
            this.emitData.emit(true);
          }
        }, {
          text: 'Close',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            console.log('Close clicked');
          }
        }]
    });
    await actionSheet.present();

    const {role} = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }


}
