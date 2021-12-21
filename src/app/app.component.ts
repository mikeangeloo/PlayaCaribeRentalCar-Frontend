import {Component, OnDestroy} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router, RouterEvent, RouterLinkActive} from "@angular/router";
import {MenuController, Platform} from "@ionic/angular";
import {BehaviorSubject, filter, Subject, takeUntil} from "rxjs";
import {SessionService} from "./services/session.service";
import {ProfileDataI} from "./interfaces/profile/profile-data.interface";
import * as module from "module";
export interface MenuTreeI
{
  module: string;
  level: number;
  icon: string;
  label: string;
  route?: string;
  active: boolean;
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
  public selectedMenu: MenuTreeI;
  public openMenu: MenuTreeI;
  public demoMenu: MenuTreeI[] = [
    {
      module: 'dashboard',
      icon: 'apps-outline',
      label: 'Dashboard',
      route: '/dashboard',
      level: 0,
      active: false
    },
    {
      module: 'contratos',
      icon: 'clipboard-outline',
      label: 'Contratos',
      route: null,
      level: 0,
      active: false,
      children: [
        {
          module: 'contratos',
          icon: 'document-outline',
          label: 'Nuevo Contrato',
          route: '/contratos/nuevo',
          level: 1,
          active: false
        },
      ]
    },
    {
      module: 'vehiculos',
      icon: 'car-sport-outline',
      label: 'Vehículos',
      route: null,
      level: 0,
      active: false
    },
    {
      module: 'reportes',
      icon: 'document-text-outline',
      label: 'Reportes',
      route: null,
      level: 0,
      active: false
    },
    {
      module: 'administracion',
      icon: 'clipboard-outline',
      label: 'Administración',
      route: null,
      level: 0,
      active: false,
      children: [
        {
          module: 'catalogo-vehiculos',
          icon: 'bookmarks',
          label: 'Catálogo de Vehículos',
          route: null,
          level: 1,
          active: false,
          children: [
            {
              module: 'catalogo-vehiculos',
              icon: 'bookmarks',
              label: 'Listado de Vehículos',
              route: '/administracion/catalogo-vehiculos/listado-vehiculos',
              level: 2,
              active: false,
            },
            {
              module: 'catalogo-vehiculos',
              icon: 'bookmarks',
              label: 'Listado de Categorías',
              route: '/administracion/catalogo-vehiculos/categorias-vehiculos',
              level: 2,
              active: false,
            },
            {
              module: 'catalogo-vehiculos',
              icon: 'bookmarks',
              label: 'Listado de Marcas',
              route: '/administracion/catalogo-vehiculos/marcas-vehiculos',
              level: 2,
              active: false,
            }
          ]
        },
        {
          module: 'control-acceso',
          icon: 'bookmarks',
          label: 'Control de Acceso',
          route: null,
          level: 1,
          active: false,
          children: [
            {
              module: 'control-acceso',
              icon: 'bookmarks',
              label: 'Listado de Usuarios',
              route: '/administracion/control-acceso/listado-usuarios',
              level: 2,
              active: false,
            },
            {
              module: 'control-acceso',
              icon: 'bookmarks',
              label: 'Listado de Sucursales',
              route: '/administracion/control-acceso/listado-sucursales',
              level: 2,
              active: false,
            },
            {
              module: 'control-acceso',
              icon: 'bookmarks',
              label: 'Listado de Roles',
              route: '/administracion/control-acceso/listado-roles',
              level: 2,
              active: false,
            },
            {
              module: 'control-acceso',
              icon: 'bookmarks',
              label: 'Listado de Aréas de trabajo',
              route: '/administracion/control-acceso/listado-areas-trabajo',
              level: 2,
              active: false,
            },
          ]
        },
        {
          module: 'empresas',
          icon: 'business',
          label: 'Empresas',
          route: null,
          level: 1,
          active: false,
          children: [
            {
              module: 'empresas',
              icon: 'business',
              label: 'Listado de Empresas',
              route: 'administracion/empresas/listado-empresas',
              level: 2,
              active: false,
            },
            {
              module: 'empresas',
              icon: 'wallet-outline',
              label: 'Listado de Comisionistas',
              route: 'administracion/empresas/listado-comisionistas',
              level: 2,
              active: false,
            }
          ]
        },
        {
          module: 'clientes',
          icon: 'bookmarks',
          label: 'Clientes',
          route: null,
          level: 1,
          active: false,
          children: [
            {
              module: 'clientes',
              icon: 'people-circle-outline',
              label: 'Listado de Clientes',
              route: '/administracion/clientes/listado-clientes',
              level: 2,
              active: false,
            }
          ]
        }
      ]
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
        //console.log('route sub -->', response);
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

  menuItemHandler(node: MenuTreeI): void {

    console.log('selected node --->', this.selectedMenu);
    console.log('node -->', node);

    if (this.selectedMenu && (this.selectedMenu.module !== node.module && this.selectedMenu.level === node.level)) {
      this.selectedMenu.active = false;
    }
    if (node !== this.selectedMenu && node.active) {
      node.active = false;
      //this.selectedMenu = node;
      console.log(node !== this.selectedMenu && node.active);
      return;
    }
    if (node === this.selectedMenu && node.active) {
      node.active = false;
      //this.selectedMenu = node;
      console.log(node === this.selectedMenu && node.active);
      return;
    }


      node.active = true;

    this.selectedMenu = node;
    return;
    //this.selectedMenu.active = true;
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

    //TODO: agregar ionViewWillLeave() y ionViewWillEnter() a todas las páginas
  }
}
