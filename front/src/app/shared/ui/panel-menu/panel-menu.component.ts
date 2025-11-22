import {
    Component,
    OnInit,
    OnDestroy
  } from "@angular/core";
import { MenuItem } from "primeng/api";
  import { PanelMenuModule } from 'primeng/panelmenu';
  import { Router, NavigationEnd } from '@angular/router';
  import { AuthService } from '../../../services/auth.service';
  import { filter } from 'rxjs/operators';
  import { Subscription } from 'rxjs';

  @Component({
    selector: "app-panel-menu",
    standalone: true,
    imports: [PanelMenuModule],
    template: `
        <p-panelMenu [model]="items" styleClass="w-full" />
    `
  })
  export class PanelMenuComponent implements OnInit, OnDestroy {
    public items: MenuItem[] = [];
    private routerSubscription: Subscription;

    constructor(
      private authService: AuthService,
      private router: Router
    ) {
      // S'abonner aux changements de route pour mettre à jour le menu
      this.routerSubscription = this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe(() => {
        this.updateMenu();
      });
    }

    ngOnInit(): void {
      this.updateMenu();
    }

    ngOnDestroy(): void {
      // Se désabonner pour éviter les fuites de mémoire
      if (this.routerSubscription) {
        this.routerSubscription.unsubscribe();
      }
    }

    updateMenu(): void {
      const isLoggedIn = this.authService.isLoggedIn();

      // Menu de base
      this.items = [
        {
          label: 'Accueil',
          icon: 'pi pi-home',
          routerLink: ['/home']
        },
        {
          label: 'Produits',
          icon: 'pi pi-barcode',
          routerLink: ['/products/list']
        }
      ];

      // Menu pour les utilisateurs non connectés
      if (!isLoggedIn) {
        this.items.push(
          {
            label: 'Connexion',
            icon: 'pi pi-sign-in',
            routerLink: ['/login']
          },
          {
            label: 'Inscription',
            icon: 'pi pi-user-plus',
            routerLink: ['/register']
          }
        );
      } else {
        // Menu pour les utilisateurs connectés
        this.items.push(
          {
            label: 'Mon panier',
            icon: 'pi pi-shopping-cart',
            routerLink: ['/cart']
          },
          {
            label: 'Ma liste',
            icon: 'pi pi-heart',
            routerLink: ['/wishlist']
          },
          {
            label: 'Mon profil',
            icon: 'pi pi-user',
            routerLink: ['/profile']
          },
          {
            label: 'Déconnexion',
            icon: 'pi pi-sign-out',
            command: () => {
              this.authService.logout();
              this.router.navigate(['/login']);
            }
          }
        );

        // Menu admin
        if (this.authService.isAdmin()) {
          this.items.push(
            {
              label: 'Administration',
              icon: 'pi pi-cog',
              routerLink: ['/admin']
            }
          );
        }
      }
    }
  }
