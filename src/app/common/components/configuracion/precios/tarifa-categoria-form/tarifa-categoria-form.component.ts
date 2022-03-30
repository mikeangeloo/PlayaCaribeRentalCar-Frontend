import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ModalController} from '@ionic/angular';
import {TarifasExtrasService} from '../../../../../services/tarifas-extras.service';
import {GeneralService} from '../../../../../services/general.service';
import {SweetMessagesService} from '../../../../../services/sweet-messages.service';
import {ToastMessageService} from '../../../../../services/toast-message.service';
import {TarifasCategoriasService} from '../../../../../services/tarifas-categorias.service';
import {TarifasCategoriasI} from '../../../../../interfaces/configuracion/tarifas-categorias.interface';

@Component({
  selector: 'app-tarifa-categoria-form',
  templateUrl: './tarifa-categoria-form.component.html',
  styleUrls: ['./tarifa-categoria-form.component.scss'],
})
export class TarifaCategoriaFormComponent implements OnInit {

  @Input() asModal: boolean;
  @Input() tarifa_categoria_id: number;
  public title: string;
  public tarifaCatForm: FormGroup;
  public tarifasCat: TarifasCategoriasI;
  constructor(
    public modalCtrl: ModalController,
    private fb: FormBuilder,
    private tarifaCatServ: TarifasCategoriasService,
    private generalServ: GeneralService,
    private sweetMsg: SweetMessagesService,
    private toastServ: ToastMessageService
  ) {
    this.title = 'Formulario Tarifas x Categoría';
    this.tarifaCatForm = this.fb.group({
      id: [null],
      categoria: [null, Validators.required],
      precio_renta: [null, Validators.required],
      activo: [null]
    });
  }

  get tc() {
    return this.tarifaCatForm.controls;
  }

  ngOnInit() {
    if (this.tarifa_categoria_id) {
      this.loadTarifasCatData();
    } else {
      this.initTarifasCatForm();
    }
  }

  initTarifasCatForm(data?) {
    this.tarifaCatForm.setValue({
      id: (data && data.id) ? data.id : null,
      categoria: (data && data.categoria) ? data.categoria : null,
      precio_renta: (data && data.precio_renta) ? data.precio_renta : null,
      activo: (data && data.activo) ? data.activo : 0,
    });
    this.tc.activo.disable();
  }



  loadTarifasCatData() {
    this.generalServ.presentLoading();
    this.tarifaCatServ.getDataById(this.tarifa_categoria_id).subscribe(res => {
      this.generalServ.dismissLoading();
      if (res.ok === true) {
        this.tarifasCat = res.data;
        this.initTarifasCatForm(res.data);
      }
    }, error => {
      this.generalServ.dismissLoading();
      console.log(error);
    });
  }

  saveUpdate() {
    if (this.tarifaCatForm.invalid) {
      this.sweetMsg.printStatus('Debe llenar los campos requeridos', 'warning');
      this.tarifaCatForm.markAllAsTouched();
      return;
    }
    this.generalServ.presentLoading('Guardando cambios ...');
    this.tarifaCatServ.saveUpdate(this.tarifaCatForm.value, this.tarifa_categoria_id).subscribe(res => {
      this.generalServ.dismissLoading();
      this.dismiss(true);
      if (res.ok === true) {
        this.toastServ.presentToast('success', res.message, 'top');
      }
    }, error => {
      console.log(error);
      this.generalServ.dismissLoading();
    });
  }

  dismiss(reload?) {
    this.modalCtrl.dismiss({
      reload
    });
  }

}
