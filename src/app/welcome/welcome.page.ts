import { Component, OnInit } from '@angular/core';
import {BehaviorSubject, interval, Observable, of, Subject, takeUntil, timer} from 'rxjs';
import * as moment from "moment-timezone";
import {SessionService} from '../services/session.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {

  public currentTime = new BehaviorSubject<string>('');
  public currentDate: Observable<string>;
  public welcomeMsg = 'Bienvenido, '
  public conciergeMsg = '¿Qué te gustaría consultar hoy?'

  private stopObservable = new Subject<boolean>()
  constructor(
    private sessionServ: SessionService
  ) { }

  ionViewWillEnter() {
    this.stopObservable = new Subject<boolean>()
    const momentES = moment().locale('es')
    this.currentTime.next(momentES.format('h:mm:ss a'));
    this.currentDate = of(momentES.format('LL'));
    interval(1000)
      .pipe(takeUntil(this.stopObservable))
      .subscribe(() => {
        this.currentTime.next(moment().format('h:mm:ss a'));
    })

    const userName = this.sessionServ.getProfile().nombre;
    this.welcomeMsg += userName;
  }

  ngOnInit() {
  }

  ionViewWillLeave() {
    this.stopObservable.next(true)
  }

}
