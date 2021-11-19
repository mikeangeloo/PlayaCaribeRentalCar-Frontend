import {Component, OnDestroy} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router, RouterEvent, RouterLinkActive} from "@angular/router";
import {MenuController, Platform} from "@ionic/angular";
import {filter, Subject, takeUntil} from "rxjs";
import {SessionService} from "./services/session.service";

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
    })
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
  ngOnDestroy(): void {
    this.destroyed.unsubscribe();
  }
}
