import {Component, EventEmitter, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {DocDataTransfer} from '../../../interfaces/shared/doc-data-tranfer.interface';
import {SweetMessagesService} from '../../../services/sweet-messages.service';
import {FilesService} from '../../../services/files.service';
import {IonButtons, ModalController} from '@ionic/angular';

@Component({
  selector: 'app-modelos-docs',
  templateUrl: './modelos-docs.component.html',
  styleUrls: ['./modelos-docs.component.scss'],
})
export class ModelosDocsComponent implements OnInit, OnChanges {

  //#region IMAGES MANAGEMENT ATTRIBUTES
  public clientes_docs: DocDataTransfer[] = [];
  public docData_docs: DocDataTransfer[] = [];
  public cobranza_docs: DocDataTransfer[] = [];

  @Input() model_id_value: number;
  @Input() docType: 'licencia_conducir' | 'cupon' | 'voucher' | 'check_indicator';
  @Input() model: 'clientes' | 'contratos' | 'cobranza' | 'check_list';
  @Input() justButton: boolean;
  @Input() btnSize: 'small' | 'default' | 'large' = 'default';
  @Input() fullSize: boolean;
  @Input() asModal: boolean = false;

  saveProcess$ = new EventEmitter();
  //#endregion


  constructor(
      private sweetMsgServ: SweetMessagesService,
      public filesServ: FilesService,
      public modalCtrl: ModalController,
  ) {

  }

  async ngOnInit() {
    if (this.model_id_value && this.asModal) {
      await this.getDocs(this.docType, this.model, this.model_id_value);
    }
  }

  async ngOnChanges(changes: SimpleChanges) {
    let _modelId = changes.model_id_value;
    if (_modelId.isFirstChange() === true || _modelId.firstChange === false) {
      if (this.model_id_value) {
        await this.getDocs(this.docType, this.model, this.model_id_value);
      }
    }
  }

  //#region CAPTURE IMG FUNCTIONS
  processDataImage(event: {imgUrl: string, image: File, type: string, fileName: string}, model = this.model) {

    this.docData_docs.push({
      file: event.image,
      url: event.imgUrl,
      uploading: false,
      success: null,
      mime_type: event.type,
      fileName: event.fileName
    });

    console.log('processDataImage model: ${model} --->' , this.docData_docs);

  }

  disableUploadButton(model = this.model): boolean {
    if (!this.docData_docs) {
      return true;
    }

    if (this.docData_docs && this.docData_docs.length > 0) {
      for (let i = 0; i < this.docData_docs.length; i++) {
        if (!this.docData_docs[i].success || !this.docData_docs[i].file_id || this.docData_docs[i].success === false) {
          return false;
        }
      }
    }
    return true;
  }

  uploadArrayDatasImg(doc_type = this.docType, model = this.model, model_id) {
    if (this.docData_docs.length === 0 ) {
      this.sweetMsgServ.printStatus('Debe adjuntar una imagen', 'warning');
      return;
    }

    if (!model_id) {
      this.sweetMsgServ.printStatus('Debe guardar primero la información de esta sección', 'warning');
      return;
    }

    //let _model_id_value;

    this.sweetMsgServ.confirmRequest().then(async (data) => {
      if (data.value) {

        console.log('here');
        let _lastServError = null;
        let formData = new FormData();
        let _positions = [];
        let _etiquetas = [];
        for (let i = 0; i< this.docData_docs.length; i++) {
          console.log('prepare formData info---->');

          if (!this.docData_docs[i].success || this.docData_docs[i].success === false || !this.docData_docs[i].file_id || this.docData_docs[i].file_id === null) {
            if (!this.docData_docs[i].etiqueta) {
              this.docData_docs[i].fileErrors = 'Ingrese un valor valido';

            } else {
              this.docData_docs[i].fileErrors = null;
            }

            if (this.docData_docs[i].fileErrors) {
              this.sweetMsgServ.printStatus('Revise que los elementos esten correctos', 'warning');
              return;
            }
            // @ts-ignore
            formData.append('files[]', this.docData_docs[i].file, this.docData_docs[i].file.name);
            //this.docDataTransfer[i].uploading = true;
            _positions.push(i);
            _etiquetas.push(this.docData_docs[i].etiqueta);
          }
        }

        formData.set('doc_type', doc_type);
        formData.set('model', model);
        formData.set('model_id', model_id);
        //formData.set('model_id_value', String(_model_id_value));
        formData.set('positions', JSON.stringify(_positions));
        formData.set('etiquetas', JSON.stringify(_etiquetas));

        if (formData.has('files[]') === false) {
          return;
        }

        let res = await this.filesServ.storeDocs(formData);
        let _lastIndex = 0;
        if (res.ok === true) {

          let _resPayload = res.payload;

          for (let i = 0; i < _resPayload.length; i++) {
            this.docData_docs[_resPayload[i].position].success = _resPayload[i].success;
            this.docData_docs[_resPayload[i].position].file_id = _resPayload[i].file_id;
            this.docData_docs[_resPayload[i].position].model = _resPayload[i].model;
            this.docData_docs[_resPayload[i].position].model_id = _resPayload[i].model_id;
            //this[`${model}_docs`][_resPayload[i].position].model_id_value = _resPayload[i].model_id_value;
            this.docData_docs[_resPayload[i].position].position = _resPayload[i].position;
            this.docData_docs[_resPayload[i].position].doc_type = _resPayload[i].doc_type;
            _lastIndex = i;
          }
        } else {
          _lastServError = res.error.errors;
        }

        console.log('imgDatasTranfer -->', this.docData_docs);

        let successTotal = 0;
        for (let j = 0; j < this.docData_docs.length; j++) {
          if (this.docData_docs[j].success === true) {
            successTotal ++;
          }
        }
        if (successTotal === this.docData_docs.length) {
          console.log('all saved');
          this.sweetMsgServ.printStatus('Se han guardado sus imagenes de manera correcta', 'success');
          this.saveProcess$.emit(true);
          // if (model === 'contratos') {
          //   this.saveProcess$('datos_generales', true);
          // }
        } else {
          console.log('error', _lastServError);
          if (_lastServError) {
            this.sweetMsgServ.printStatusArray(_lastServError, 'error');
          } else {
            this.sweetMsgServ.printStatus('Se produjo un error al guardar una de sus imagenes, intentelo nuevamente o eliminela de la cola', 'error');
          }
        }
      }
    });
  }


  async removeFromDisk(fileData: DocDataTransfer, index, model = this.model) {
    await this.sweetMsgServ.confirmRequest('¿Estás seguro de querer eliminar el archivo?').then(async (data) => {
      if (data.value) {
        let _payload = {
          doc_type: fileData.doc_type,
          model: fileData.model,
          model_id: fileData.model_id,
          //model_id_value: fileData.model_id_value,
          id: fileData.file_id
        }
        let query = await this.filesServ.deleteDoc(_payload);
        if (query.ok) {
          this.sweetMsgServ.printStatus(query.data.message, 'success');
          this.removeImg(index, model);
        } else {
          this.sweetMsgServ.printStatusArray(query.error.error.errors, 'error');
          console.log(query.error);
        }
      }
    });
  }


  removeImg(index, model = this.model) {
    this.docData_docs.splice(index, 1);
  }

  async getDocs(doc_type = this.docType, model = this.model, model_id: number) {
    let _payload = {
      doc_type,
      model,
      model_id
    }
    let res = await this.filesServ.getDocs(_payload);

    if (res.ok) {
      this.docData_docs = [];

      for (let i = 0; i < res.data.length; i++) {
        let _docData: DocDataTransfer = {
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
        this.docData_docs.push(_docData);
      }
    } else {
      this.docData_docs = [];
      console.log('error --->', res.error);
    }
  }

  isImage(fileType: string): boolean {
    let imgTypes = ['image/png', 'image/jpg', 'image/jpeg'];
    let find = imgTypes.find(x => x === fileType);
    return find && find !== 'unknown';
  }

  dismiss(reload?) {
    this.modalCtrl.dismiss({
      reload
    });
  }
  //#endregion

}
