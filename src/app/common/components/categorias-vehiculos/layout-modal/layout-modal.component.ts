import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {ModalController} from "@ionic/angular";
import { DocDataTransfer } from 'src/app/interfaces/shared/doc-data-tranfer.interface';
import { FilesService } from 'src/app/services/files.service';

@Component({
  selector: 'app-layout-modal',
  templateUrl: './layout-modal.component.html',
  styleUrls: ['./layout-modal.component.scss'],
})
export class LayoutModalComponent implements OnInit {

  public categorias_vehiculos_docs = [];
  public title;
  public layoutSeleccionado: DocDataTransfer = null;
  @Input() asModal = true


  constructor(
    public modalCtrl: ModalController,
    public filesServ: FilesService,
    private fb: FormBuilder,
  ) {
    this.title = 'Seleccionar layout';
  }

  async ngOnInit() {
    await this.getDocs();
  }

  async getDocs() {
    let _payload = {
      doc_type: "layout",
      model: "categorias_vehiculos",
      model_id: -100
    }
    let res = await this.filesServ.getDocs(_payload);

    if (res.ok) {
      this.categorias_vehiculos_docs = [];

      for (let i = 0; i < res.data.length; i++) {
        let _docData: DocDataTransfer = {
          fileName: res.data[i].nombre_archivo,
          position: res.data[i].position,
          success: res.data[i].success,
          file_id: res.data[i].file_id,
          doc_type: res.data[i].doc_type,
          model: res.data[i].model,
          model_id: res.data[i].model_id,
          mime_type: res.data[i].mime_type,
          url: res.data[i].file,
          etiqueta: res.data[i].etiqueta
        }
        this.categorias_vehiculos_docs.push(_docData);
      }
    } else {
      this.categorias_vehiculos_docs = [];
      console.log('error --->', res.error);
    }
  }

  seleccionarLayout() {
    this.dismiss(this.layoutSeleccionado)
  }

  dismiss(data?) {
    this.modalCtrl.dismiss({layout: data});
  }

}
