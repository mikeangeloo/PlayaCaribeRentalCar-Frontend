import {CUSTOM_ELEMENTS_SCHEMA, DEFAULT_CURRENCY_CODE, LOCALE_ID, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {JwtInterceptor} from "../interceptors/jwt-interceptor";
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import {NgxMaterialTimepickerModule} from "ngx-material-timepicker";
import { NgxSpinnerModule } from "ngx-spinner";

import locateESMX from '@angular/common/locales/es-MX'
import {registerLocaleData} from '@angular/common';
import {AppCommonModule} from './common/common.module';
import {DirectivesModule} from './directives/directives.module';


registerLocaleData(locateESMX, 'es-MX')

@NgModule({
  declarations: [
    AppComponent
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot({
      mode: 'ios'
    }),
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
    NgxMaterialTimepickerModule,
    NgxSpinnerModule,
    AppCommonModule,
    DirectivesModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy,
    },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    {
      provide: LOCALE_ID, useValue: 'es-MX'
    },
    { provide: DEFAULT_CURRENCY_CODE, useValue: '' },
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {}
