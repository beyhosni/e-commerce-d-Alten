import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';

import { HeaderComponent } from './header.component';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let cartServiceSpy: jasmine.SpyObj<CartService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let element: HTMLElement;

  beforeEach(async () => {
    cartServiceSpy = jasmine.createSpyObj('CartService', ['getCartItemCount']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn', 'isAdmin', 'logout']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      providers: [
        { provide: CartService, useValue: cartServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update auth status on init', () => {
    authServiceSpy.isLoggedIn.and.returnValue(true);
    authServiceSpy.isAdmin.and.returnValue(false);

    component.ngOnInit();

    expect(authServiceSpy.isLoggedIn).toHaveBeenCalled();
    expect(component.isLoggedIn).toBe(true);
    expect(component.isAdmin).toBe(false);
  });

  it('should update cart item count on init', () => {
    authServiceSpy.isLoggedIn.and.returnValue(true);
    cartServiceSpy.getCartItemCount.and.returnValue(of(5));

    component.ngOnInit();

    expect(cartServiceSpy.getCartItemCount).toHaveBeenCalled();
    expect(component.cartItemCount).toBe(5);
  });

  it('should not update cart item count when not logged in', () => {
    authServiceSpy.isLoggedIn.and.returnValue(false);

    component.ngOnInit();

    expect(cartServiceSpy.getCartItemCount).not.toHaveBeenCalled();
    expect(component.cartItemCount).toBe(0);
  });

  it('should logout and navigate to login', () => {
    component.logout();

    expect(authServiceSpy.logout).toHaveBeenCalled();
    expect(component.isLoggedIn).toBe(false);
    expect(component.isAdmin).toBe(false);
    expect(component.cartItemCount).toBe(0);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should show cart badge when items in cart', () => {
    component.cartItemCount = 3;
    fixture.detectChanges();

    const badge = element.querySelector('.badge');
    expect(badge).toBeTruthy();
    expect(badge?.textContent).toBe('3');
  });

  it('should not show cart badge when no items in cart', () => {
    component.cartItemCount = 0;
    fixture.detectChanges();

    const badge = element.querySelector('.badge');
    expect(badge).toBeFalsy();
  });

  it('should show admin link when admin', () => {
    component.isLoggedIn = true;
    component.isAdmin = true;
    fixture.detectChanges();

    const adminLink = element.querySelector('[routerlink="admin"]');
    expect(adminLink).toBeTruthy();
  });

  it('should not show admin link when not admin', () => {
    component.isLoggedIn = true;
    component.isAdmin = false;
    fixture.detectChanges();

    const adminLink = element.querySelector('[routerlink="admin"]');
    expect(adminLink).toBeFalsy();
  });

  it('should show user menu when logged in', () => {
    component.isLoggedIn = true;
    fixture.detectChanges();

    const userDropdown = element.querySelector('#navbarDropdown');
    expect(userDropdown).toBeTruthy();

    const loginLink = element.querySelector('[routerlink="login"]');
    const registerLink = element.querySelector('[routerlink="register"]');
    expect(loginLink).toBeFalsy();
    expect(registerLink).toBeFalsy();
  });

  it('should show auth links when not logged in', () => {
    component.isLoggedIn = false;
    fixture.detectChanges();

    const userDropdown = element.querySelector('#navbarDropdown');
    expect(userDropdown).toBeFalsy();

    const loginLink = element.querySelector('[routerlink="login"]');
    const registerLink = element.querySelector('[routerlink="register"]');
    expect(loginLink).toBeTruthy();
    expect(registerLink).toBeTruthy();
  });
});
