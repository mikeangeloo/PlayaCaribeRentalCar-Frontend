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
      module: 'people',
      icon: 'people',
      label: 'Primer Nivel',
      route: '/test',
      level: 0,
      children: [
        {
          module: 'people',
          icon: 'people',
          label: 'Segundo Nivel',
          route: '/test/test2',
          level: 1,
          children: [
            {
              module: 'people',
              icon: 'people',
              label: 'Tercer 3.1 Nivel',
              route: '/test/test2/test3',
              level: 3,
              children: [
                {
                  module: 'people',
                  icon: 'people',
                  label: 'Cuarto Nivel',
                  route: '/test/test2/test3/test/4',
                  level: 4,
                }
              ]
            },
            {
              module: 'people',
              icon: 'people',
              label: 'Tercer 3.2 Nivel',
              route: '/test/test2/test3',
              level: 3,
            }
          ]
        }
      ]
    }
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
