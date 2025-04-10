import {Component, OnDestroy} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router, RouterEvent} from '@angular/router';
import {MenuController, Platform} from '@ionic/angular';
import {filter, Subject, takeUntil} from 'rxjs';
import {SessionService} from './services/session.service';
import {RoleLevelsEnum, RoleLevelsTypes} from './enums/role-levels.enum';

export interface MenuTreeI
{
  module: string;
  level: number;
  icon: string;
  label: string;
  route?: string;
  active: boolean;
  roleScopes: RoleLevelsTypes[]
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
  public menuTreeSideBar: MenuTreeI[] = [
    {
      module: 'dashboard',
      icon: 'apps-outline',
      label: 'Dashboard',
      route: '/dashboard',
      level: 0,
      active: false,
      roleScopes: [RoleLevelsEnum.ADMINISTRATOR]
    },
    {
      module: 'vehiculos',
      icon: 'car-sport-outline',
      label: 'Vehículos',
      route: null,
      level: 0,
      active: false,
      roleScopes: [RoleLevelsEnum.ADMINISTRATOR, RoleLevelsEnum.MANAGAER, RoleLevelsEnum.SALESAGENT],
      children: [
        {
          module: 'vehiculos',
          icon: 'document-outline',
          label: 'Lista de Vehiculos  | Estatus',
          route: 'vehiculos/list',
          level: 1,
          active: false,
          roleScopes: [RoleLevelsEnum.NOPROTECTION]
        },
      ]
    },
    {
      module: 'reportes',
      icon: 'document-text-outline',
      label: 'Reportes',
      route: null,
      level: 0,
      active: false,
      roleScopes: [RoleLevelsEnum.ADMINISTRATOR, RoleLevelsEnum.MANAGAER],
      children: [
        {
          module: 'reportes',
          icon: 'document-outline',
          label: 'Estatus de los Vehiculos',
          route: 'reportes/estatus-vehiculos',
          level: 1,
          active: false,
          roleScopes: [RoleLevelsEnum.NOPROTECTION]
        },
        {
          module: 'reportes',
          icon: 'document-outline',
          label: 'Servicios de Mantenimiento',
          route: 'reportes/mantenimiento-vehiculos',
          level: 1,
          active: false,
          roleScopes: [RoleLevelsEnum.NOPROTECTION]
        },
        {
          module: 'reportes',
          icon: 'document-outline',
          label: 'Exedentes de Kilometraje y Gasolina ',
          route: 'reportes/exedente-kilometraje-gasolina',
          level: 1,
          roleScopes: [RoleLevelsEnum.NOPROTECTION],
          active: false
        },
        {
          module: 'reportes',
          icon: 'document-outline',
          label: 'Polizas y seguros ',
          route: 'reportes/polizas-seguros',
          level: 1,
          roleScopes: [RoleLevelsEnum.NOPROTECTION],
          active: false
        },
        {
          module: 'reportes',
          icon: 'document-outline',
          label: 'Detalle Pagos',
          route: 'reportes/detalle-pagos',
          level: 1,
          roleScopes: [RoleLevelsEnum.NOPROTECTION],
          active: false
        },
        {
          module: 'reportes',
          icon: 'document-outline',
          label: 'Rentas por Vehículo',
          route: 'reportes/rentas-por-vehiculo',
          level: 1,
          roleScopes: [RoleLevelsEnum.NOPROTECTION],
          active: false
        },
        {
          module: 'reportes',
          icon: 'document-outline',
          label: 'Rentas por Comisionistas',
          route: 'reportes/rentas-por-comisionistas',
          level: 1,
          roleScopes: [RoleLevelsEnum.NOPROTECTION],
          active: false
        },
        {
          module: 'reportes',
          icon: 'document-outline',
          label: 'Reporte General',
          route: 'reportes/reporte-general',
          level: 1,
          roleScopes: [RoleLevelsEnum.NOPROTECTION],
          active: false
        },
      ]
    },
    {
      module: 'administracion',
      icon: 'clipboard-outline',
      label: 'Administración',
      route: null,
      level: 0,
      active: false,
      roleScopes: [RoleLevelsEnum.ADMINISTRATOR, RoleLevelsEnum.MANAGAER],
      children: [
        {
          module: 'catalogo-vehiculos',
          icon: 'bookmarks',
          label: 'Catálogo de Vehículos',
          route: null,
          level: 1,
          active: false,
          roleScopes: [RoleLevelsEnum.NOPROTECTION],
          children: [
            {
              module: 'catalogo-vehiculos',
              icon: 'bookmarks',
              label: 'Inventario de Vehículos',
              route: '/administracion/catalogo-vehiculos/listado-vehiculos',
              level: 2,
              roleScopes: [RoleLevelsEnum.NOPROTECTION],
              active: false,
            },
            {
              module: 'catalogo-vehiculos',
              icon: 'bookmarks',
              label: 'Listado de Categorías',
              route: '/administracion/catalogo-vehiculos/categorias-vehiculos',
              level: 2,
              roleScopes: [RoleLevelsEnum.NOPROTECTION],
              active: false,
            },
            {
              module: 'catalogo-vehiculos',
              icon: 'bookmarks',
              label: 'Listado de Marcas',
              route: '/administracion/catalogo-vehiculos/marcas-vehiculos',
              level: 2,
              roleScopes: [RoleLevelsEnum.NOPROTECTION],
              active: false,
            },
            {
              module: 'catalogo-vehiculos',
              icon: 'bookmarks',
              label: 'Listado de Clases',
              route: '/administracion/catalogo-vehiculos/clases-vehiculos',
              level: 2,
              roleScopes: [RoleLevelsEnum.NOPROTECTION],
              active: false,
            },
            {
              module: 'catalogo-vehiculos',
              icon: 'bookmarks',
              label: 'Listado de Polizas',
              route: '/administracion/catalogo-vehiculos/polizas',
              level: 2,
              roleScopes: [RoleLevelsEnum.NOPROTECTION],
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
          roleScopes: [RoleLevelsEnum.NOPROTECTION],
          children: [
            {
              module: 'control-acceso',
              icon: 'bookmarks',
              label: 'Listado de Usuarios',
              route: '/administracion/control-acceso/listado-usuarios',
              level: 2,
              roleScopes: [RoleLevelsEnum.NOPROTECTION],
              active: false,
            },
            {
              module: 'control-acceso',
              icon: 'bookmarks',
              label: 'Listado de Sucursales',
              route: '/administracion/control-acceso/listado-sucursales',
              level: 2,
              roleScopes: [RoleLevelsEnum.NOPROTECTION],
              active: false,
            },
            // {
            //   module: 'control-acceso',
            //   icon: 'bookmarks',
            //   label: 'Listado de Roles',
            //   route: '/administracion/control-acceso/listado-roles',
            //   level: 2,
            //   roleScopes: [RoleLevelsEnum.NOPROTECTION],
            //   active: false,
            // },
            {
              module: 'control-acceso',
              icon: 'bookmarks',
              label: 'Listado de Aréas de trabajo',
              route: '/administracion/control-acceso/listado-areas-trabajo',
              level: 2,
              roleScopes: [RoleLevelsEnum.NOPROTECTION],
              active: false,
            },
          ]
        },
        {
          module: 'hoteles',
          icon: 'business',
          label: 'Externos',
          route: null,
          level: 1,
          active: false,
          roleScopes: [RoleLevelsEnum.NOPROTECTION],
          children: [
            {
              module: 'hoteles',
              icon: 'business',
              label: 'Listado de Externos',
              route: 'administracion/externos/listado-externos',
              level: 2,
              roleScopes: [RoleLevelsEnum.NOPROTECTION],
              active: false,
            },
          ]
        },
        {
          module: 'comisionistas',
          icon: 'people',
          label: 'Comisionistas',
          route: null,
          level: 1,
          active: false,
          roleScopes: [RoleLevelsEnum.NOPROTECTION],
          children: [
            {
              module: 'comisionistas',
              icon: 'people',
              label: 'Listado de Comisionistas',
              route: 'administracion/comisionistas/listado-comisionistas',
              level: 2,
              roleScopes: [RoleLevelsEnum.NOPROTECTION],
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
          roleScopes: [RoleLevelsEnum.NOPROTECTION],
          active: false,
          children: [
            {
              module: 'clientes',
              icon: 'people-circle-outline',
              label: 'Listado de Clientes',
              route: '/administracion/clientes/listado-clientes',
              level: 2,
              roleScopes: [RoleLevelsEnum.NOPROTECTION],
              active: false,
            }
          ]
        },
        {
          module: 'catalogos',
          icon: 'folder',
          label: 'Catálogos',
          route: null,
          level: 1,
          active: false,
          roleScopes: [RoleLevelsEnum.NOPROTECTION],
          children: [
            {
              module: 'catalogos',
              icon: 'cash',
              label: 'Precios',
              route: null,
              level: 2,
              active: false,
              roleScopes: [RoleLevelsEnum.NOPROTECTION],
              children: [
                {
                  module: 'catalogos',
                  icon: 'pricetags-outline',
                  label: 'Tarifas x Categoría',
                  route: '/administracion/catalogos/precios/tarifas-categorias',
                  level: 3,
                  active: false,
                  roleScopes: [RoleLevelsEnum.NOPROTECTION],
                },
                {
                  module: 'catalogos',
                  icon: 'pricetags',
                  label: 'Tarifas Extras',
                  route: '/administracion/catalogos/precios/tarifas-extras',
                  level: 3,
                  active: false,
                  roleScopes: [RoleLevelsEnum.NOPROTECTION],
                },
                {
                  module: 'catalogos',
                  icon: 'pricetags',
                  label: 'Cargos Extras',
                  route: '/administracion/catalogos/precios/cargos-extras',
                  level: 3,
                  active: false,
                  roleScopes: [RoleLevelsEnum.NOPROTECTION],
                },
                {
                  module: 'catalogos',
                  icon: 'pricetags',
                  label: 'Tipos Cambio',
                  route: '/administracion/catalogos/tipos-cambio',
                  level: 3,
                  active: false,
                  roleScopes: [RoleLevelsEnum.NOPROTECTION],
                }
              ]
            },
            {
              module: 'catalogos',
              icon: 'location',
              label: 'Ubicaciones',
              route: '/administracion/catalogos/ubicaciones',
              level: 2,
              active: false,
              roleScopes: [RoleLevelsEnum.NOPROTECTION],
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

      this.sessionService.getRoleLevel();
      this.sessionService.getProfile();
      if (this.sessionService.isLogged()) {
        this.sessionService.logged$.next(true);
      }

    });
  }

  closeMenu() {
    this.menu.close();
    //this.menu.toggle();
  }

  menuItemHandler(node: MenuTreeI): void {
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
    if (this.sessionService.$roleLevelsScope.value) {
      switch (this.sessionService.$roleLevelsScope.value) {
        case 20:
          return 'assets/img/insignias/admin.png';
          break;
        case 15:
          return 'assets/img/insignias/manager.png';
        case 5:
          return 'assets/img/insignias/sales.png';
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
