import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  cartItemCount = 0;
  isLoggedIn = false;
  isAdmin = false;
  private routerSubscription: Subscription;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {
    // S'abonner aux changements de route pour mettre à jour l'état d'authentification
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateAuthStatus();
      this.updateCartItemCount();
    });
  }

  ngOnInit(): void {
    this.updateAuthStatus();
    this.updateCartItemCount();
  }

  ngOnDestroy(): void {
    // Se désabonner pour éviter les fuites de mémoire
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  updateAuthStatus(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.isAdmin = this.authService.isAdmin();
  }

  updateCartItemCount(): void {
    if (this.isLoggedIn) {
      this.cartService.getCartItemCount().subscribe(count => {
        this.cartItemCount = count;
      });
    } else {
      this.cartItemCount = 0;
    }
  }

  logout(): void {
    this.authService.logout();
    this.isLoggedIn = false;
    this.isAdmin = false;
    this.cartItemCount = 0;
    this.router.navigate(['/login']);
  }
}
