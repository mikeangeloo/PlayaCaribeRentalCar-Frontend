import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {ActionSheetController, Platform} from '@ionic/angular';
import { Camera, CameraResultType, Photo } from '@capacitor/camera';

export interface UserPhoto {
  filepath: string;
  webviewPath: string;
}

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss'],
})
export class CameraComponent implements OnInit, OnChanges {


  @Output() captureImg = new EventEmitter();
  @Input() autoLaunchCamera: boolean;
  @Input() justButton = false;
  @Input() single: boolean;
  @Input() micuenta: boolean;
  @Input() specialFab: boolean;
  public image: File;

  @ViewChild('fileUpload', {read: ElementRef}) fileUpload: ElementRef;

  constructor(
    platform: Platform,
    public actionSheetController: ActionSheetController
  ) {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    // let autoLauchChange = changes.autoLauchCamera;
    // if (autoLauchChange.firstChange === false || autoLauchChange.isFirstChange() === true) {
    //   if (this.autoLauchCamera && this.autoLauchCamera === true) {
    //     this.takePicture();
    //   }
    // }

  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Opciones',
      cssClass: 'my-custom-class',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Capturar Imagen',
          icon: 'camera',
          handler: () => {
            console.log('Capturar Imagen clicked');
            this.takePicture();
          },
        },
        {
          text: 'Adjuntar archivo',
          icon: 'document-attach',
          handler: () => {
            console.log('Adjuntar archivo clicked');
            this.attachFiles();
          },
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel',
          cssClass: 'action-sheet-cancel',
          handler: () => {
            console.log('Cancel clicked');
          },
        },
      ],
    });
    await actionSheet.present();

    const { role } = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  public attachFiles() {
    this.fileUpload.nativeElement.click();
  }

  onFileSelected(event) {
    const file:File = event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (_event) => {
      this.captureImg.emit(
          {
            imgUrl: reader.result,
            image: file,
            type: file.type,
            fileName: file.name
          }
      );
    }

    console.log('files --->', file);
  }

  public async takePicture() {
    const image = await Camera.getPhoto({
      quality: 50,
      width: 800,
      correctOrientation: true,
      allowEditing: true,
      resultType: CameraResultType.Uri
    });

    // image.webPath will contain a path that can be set as an image src.
    // You can access the original file using image.path, which can be
    // passed to the Filesystem API to read the raw data of the image,
    // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
    var imageUrl = image.webPath;

    const base64 = '...';
    const imageName = 'camera-capture.png';
    const imageBlob = await this.convertBlog(image);
    this.image = new File([imageBlob], imageName, { type: 'image/png' });

    // Can be set to the src of an image now
    this.captureImg.emit(
        {
          imgUrl: imageUrl,
          image: this.image,
          type: 'image/png',
          fileName: this.image.name
        }
      );

    // console.log('imgURL', imageUrl);
    // console.log('captureImg', this.captureImg);
  };

  private async convertBlog(cameraPhoto: Photo) {
    const response = await fetch(cameraPhoto.webPath);
    const blob = await response.blob();

    return blob;
  }

  private async readAsBase64(cameraPhoto: Photo) {
    // "hybrid" will detect Cordova or Capacitor
       // Fetch the photo, read as a blob, then convert to base64 format
       const response = await fetch(cameraPhoto.webPath);
       const blob = await response.blob();

       return await this.convertBlobToBase64(blob) as string;
  }

  convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader;
    reader.onerror = reject;
    reader.onload = () => {
        resolve(reader.result);
    };
    reader.readAsArrayBuffer(blob);
  });

}
