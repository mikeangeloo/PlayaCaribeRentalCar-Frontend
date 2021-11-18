import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {environment} from "../../../environments/environment";
import {SessionService} from "../../services/session.service";
import {AlertController, NavController} from "@ionic/angular";
import {ActivatedRoute} from "@angular/router";
import {SweetMessagesService} from "../../services/sweet-messages.service";
import {HttpErrorResponse} from "@angular/common/http";
import {GeneralService} from "../../services/general.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  returnUrl: string;
  popupWindow: any;
  loginForm: FormGroup;
  public spinner = false;
  public token: any;

  public status: string;
  public message_success: string;
  public app_title = environment.app_name;

  constructor(
    private sessionService: SessionService,
    public navigate: NavController,
    private route: ActivatedRoute,
    private alertCtrl: AlertController,
    private fb: FormBuilder,
    public sweetMsg: SweetMessagesService,
    public generalServ: GeneralService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    if (this.sessionService.getToken()) {
      this.navigate.navigateForward(['/dashboard']);
    }
  }

  // convenience getter for easy access to form fields
  get cf() {
    return this.loginForm.controls;
  }

  ngOnInit() {

  }

  onResize(event) {
    console.log(event);
    let _height = document.getElementById('login-form').offsetHeight;
    document.getElementById('login-background').style.height = String(_height) + 'px';
  }

  onSubmit() {
    this.spinner = true;

    let loginData = this.loginForm.value;
    loginData.username = String(loginData.email).trim();
    loginData.password = String(loginData.password).trim();

    let _data = {
      username: loginData.email,
      password: loginData.password
    };


    this.sessionService.signup(_data).subscribe(
      (res) => {
        this.spinner = false;
        if (res.ok === true) {
          // this.status = 'success';
          // this.message_success = 'Bienvenido nuevamente';
          if (res.validateCode && res.validateCode === true) {
            this.sweetMsg.printStatus('Necesitamos verificar tu cuenta, para ello te hemos enviado un correo con instrucciones', 'warning');
            this.generalServ.verifyEmail$.next(_data.username);
            this.goToVerifyUser();
            return;
          }
          this.token = res.token;
          sessionStorage.setItem(this.sessionService.JWToken, this.token);

          this.loginForm.reset();
          this.sweetMsg.printStatus(res.message, 'success');
          this.navigate.navigateRoot(['dashboard']);
        }
      },
      (error: HttpErrorResponse) => {
        console.log(error);
        this.spinner = false;
        this.loginForm.controls.password.setValue(null);
        if (error.statusText === 'Unauthorized') {
          this.sweetMsg.printStatusArray(error.error.errors, 'error');
          // this.errorAlert('', 'Unauthorized', error.error.errors, 'OK');
        } else if (error.error.errors) {
          this.sweetMsg.printStatusArray(error.error.errors, 'error');
          // this.errorAlert(
          //   '',
          //   'Credenciales Invalidas',
          //   error.error.errors[0],
          //   'OK'
          // );
        }
        if (error.status === 500 || error.status === 404) {
          this.sweetMsg.printStatus('Error al conectar con el servidor', 'error');
          // this.errorAlert(
          //   '',
          //   'Error ' + error.status,
          //   'Error al conectar con el servidor',
          //   'OK'
          // );
        }
      }
    );
  }

  goToVerifyUser() {
    this.navigate.navigateRoot(['otp/verify-register']);
  }

  goToPwdRecovery() {
    this.navigate.navigateRoot(['otp/recovery-pwd']);
  }

  async errorAlert(
    header: string,
    subHeader: string,
    message: string,
    buttons: string
  ) {
    const alert = await this.alertCtrl.create({
      header,
      subHeader,
      message,
      buttons: [buttons],
    });
    await alert.present();
  }

}
