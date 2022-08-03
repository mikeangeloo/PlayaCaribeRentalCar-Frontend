import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DocDataTransfer } from 'src/app/interfaces/shared/doc-data-tranfer.interface';
import { FilesService } from 'src/app/services/files.service';

@Component({
  selector: 'app-add-layaout-modal',
  templateUrl: './add-layaout-modal.component.html',
  styleUrls: ['./add-layaout-modal.component.scss'],
})
export class AddLayaoutModalComponent implements OnInit {
  public title;
  public layoutSeleccionado: DocDataTransfer = null;
  @Input() modelo_id: number;

  constructor(
    public modalCtrl: ModalController,
    public filesServ: FilesService,
  ) {
    this.title = 'Agregar layouts';
   }

  ngOnInit() {}

  dismiss(data?) {
    this.modalCtrl.dismiss({reload: data});
  }

}
