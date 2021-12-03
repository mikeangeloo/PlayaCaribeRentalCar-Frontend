import {Component, OnDestroy} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router, RouterEvent, RouterLinkActive} from "@angular/router";
import {MenuController, Platform} from "@ionic/angular";
import {BehaviorSubject, filter, Subject, takeUntil} from "rxjs";
import {SessionService} from "./services/session.service";
import {ProfileDataI} from "./interfaces/profile/profile-data.interface";
export interface MenuTreeI
{
  module: string;
  level: number;
  icon: string;
  label: string;
  route: string;
  children?: MenuTreeI [];
}
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent implements OnDestroy {
  public destroyed = new Subject<any>();
  public showMenu = true;

  showSubmenu: string;
  public subMenuOpen = false;
  public _navRoute: string;

  public demoMenu: MenuTreeI[] = [
    {
      module: 'dashboard',
      icon: 'apps-outline',
      label: 'Dashboard',
      route: '/dashboard',
      level: 0
    },
    {
      module: 'contratos',
      icon: 'clipboard-outline',
      label: 'Contratos',
      route: '/',
      level: 0,
      children: [
        {
          module: 'contratos',
          icon: 'document-outline',
          label: 'Nuevo Contrato',
          route: '/',
          level: 1
        },
      ]
    },
    {
      module: 'vehiculos',
      icon: 'car-sport-outline',
      label: 'Vehículos',
      route: '/',
      level: 0
    },
  ];
  constructor(
    public route: ActivatedRoute,
    private platform: Platform,
    private router: Router,
    private menu: MenuController,
    public sessionService: SessionService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(async () => {
      this.router.events.pipe(
        filter((event: RouterEvent) => event instanceof NavigationEnd),
        takeUntil(this.destroyed)
      ).subscribe((response) => {
        console.log('route sub -->', response);
        this._navRoute = response.url;
        if (response.url === '/login' || response.url === '/otp/recovery-pwd') {
          this.showMenu = false;
        } else {
          this.showMenu = true;
        }
      });

      this.sessionService.getRole();
      this.sessionService.getProfile();

    });
  }

  closeMenu() {
    this.menu.close();
    //this.menu.toggle();
  }

  menuItemHandler(type): void {
    if (this.subMenuOpen === false) {
      this.subMenuOpen = true;
      this.showSubmenu = type;
    } else {
      this.subMenuOpen = false;
      this.showSubmenu = null;
    }

  }

  isActive(check) {
    if (this._navRoute) {
      let _navArray = this._navRoute.split('/');
      return _navArray.find(x => x == check);
    }
  }

  returnInsignia(): string {
    if (this.sessionService.$role.value) {
      switch (this.sessionService.$role.value.toLowerCase()) {
        case 'administrador':
          return 'assets/img/insignias/admin.png';
          break;
        case 'vendedor':
          return 'assets/img/insignias/sales.png';
        case 'gerente':
          return 'assets/img/insignias/manager.png';
        default:
          return 'assets/img/insignias/sales.png';
      }
    } else {
      return 'assets/img/insignias/sales.png';
    }
  }


  ngOnDestroy(): void {
    this.destroyed.unsubscribe();
  }
}
