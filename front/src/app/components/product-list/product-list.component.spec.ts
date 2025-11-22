import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ProductListComponent } from './product-list.component';
import { ProductService, Product } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { AuthService } from '../../services/auth.service';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productServiceSpy: jasmine.SpyObj<ProductService>;
  let cartServiceSpy: jasmine.SpyObj<CartService>;
  let wishlistServiceSpy: jasmine.SpyObj<WishlistService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let debugElements: DebugElement[];

  const mockProducts: Product[] = [
    {
      id: 1,
      code: 'P001',
      name: 'Smartphone Pro',
      description: 'Un smartphone haut de gamme',
      image: 'https://example.com/image1.jpg',
      category: 'Électronique',
      price: 899.99,
      quantity: 50,
      internalReference: 'REF-SP-001',
      shellId: 1,
      inventoryStatus: 'INSTOCK',
      rating: 5,
      createdAt: 1625097600000,
      updatedAt: 1625184000000
    },
    {
      id: 2,
      code: 'P002',
      name: 'Laptop Ultra',
      description: 'Un ordinateur portable ultra-léger',
      image: 'https://example.com/image2.jpg',
      category: 'Informatique',
      price: 1299.99,
      quantity: 5,
      internalReference: 'REF-LU-002',
      shellId: 2,
      inventoryStatus: 'LOWSTOCK',
      rating: 4,
      createdAt: 1625097600000,
      updatedAt: 1625184000000
    },
    {
      id: 3,
      code: 'P003',
      name: 'Tablette HD',
      description: 'Une tablette avec un écran haute définition',
      image: 'https://example.com/image3.jpg',
      category: 'Électronique',
      price: 449.99,
      quantity: 0,
      internalReference: 'REF-TH-003',
      shellId: 3,
      inventoryStatus: 'OUTOFSTOCK',
      rating: 3,
      createdAt: 1625097600000,
      updatedAt: 1625184000000
    }
  ];

  beforeEach(async () => {
    productServiceSpy = jasmine.createSpyObj('ProductService', ['getProducts']);
    cartServiceSpy = jasmine.createSpyObj('CartService', ['getCart', 'addToCart', 'removeFromCart', 'updateCartItemQuantity']);
    wishlistServiceSpy = jasmine.createSpyObj('WishlistService', ['getWishlist', 'addToWishlist', 'removeFromWishlist']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn']);

    await TestBed.configureTestingModule({
      declarations: [ProductListComponent],
      providers: [
        { provide: ProductService, useValue: productServiceSpy },
        { provide: CartService, useValue: cartServiceSpy },
        { provide: WishlistService, useValue: wishlistServiceSpy },
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on init', () => {
    productServiceSpy.getProducts.and.returnValue(of(mockProducts));
    component.ngOnInit();
    fixture.detectChanges();

    expect(productServiceSpy.getProducts).toHaveBeenCalled();
    expect(component.products).toEqual(mockProducts);
    expect(component.filteredProducts).toEqual(mockProducts);
    expect(component.loading).toBe(false);
  });

  it('should extract categories from products', () => {
    productServiceSpy.getProducts.and.returnValue(of(mockProducts));
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.categories).toContain('Électronique');
    expect(component.categories).toContain('Informatique');
  });

  it('should filter products by category', () => {
    productServiceSpy.getProducts.and.returnValue(of(mockProducts));
    component.ngOnInit();
    fixture.detectChanges();

    component.selectedCategory = 'Électronique';
    component.applyFilters();
    fixture.detectChanges();

    expect(component.filteredProducts.length).toBe(2);
    expect(component.filteredProducts.every(p => p.category === 'Électronique')).toBe(true);
  });

  it('should filter products by status', () => {
    productServiceSpy.getProducts.and.returnValue(of(mockProducts));
    component.ngOnInit();
    fixture.detectChanges();

    component.selectedStatus = 'INSTOCK';
    component.applyFilters();
    fixture.detectChanges();

    expect(component.filteredProducts.length).toBe(1);
    expect(component.filteredProducts[0].inventoryStatus).toBe('INSTOCK');
  });

  it('should paginate products correctly', () => {
    productServiceSpy.getProducts.and.returnValue(of(mockProducts));
    component.itemsPerPage = 2;
    component.ngOnInit();
    fixture.detectChanges();

    const paginatedProducts = component.paginatedProducts;
    expect(paginatedProducts.length).toBe(2);
    expect(paginatedProducts[0].id).toBe(1);
    expect(paginatedProducts[1].id).toBe(2);
  });

  it('should calculate total pages correctly', () => {
    productServiceSpy.getProducts.and.returnValue(of(mockProducts));
    component.itemsPerPage = 2;
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.totalPages).toBe(2);
  });

  it('should change page correctly', () => {
    component.totalPages = 3;
    component.changePage(2);
    expect(component.currentPage).toBe(2);

    component.changePage(0);
    expect(component.currentPage).toBe(1);

    component.changePage(4);
    expect(component.currentPage).toBe(3);
  });

  it('should add product to cart', () => {
    authServiceSpy.isLoggedIn.and.returnValue(true);
    const productId = 1;
    const quantity = 2;

    component.addToCart(productId, quantity);
    expect(cartServiceSpy.addToCart).toHaveBeenCalledWith(productId, quantity);
  });

  it('should show alert when not logged in and trying to add to cart', () => {
    authServiceSpy.isLoggedIn.and.returnValue(false);
    spyOn(window, 'alert');

    component.addToCart(1, 1);
    expect(window.alert).toHaveBeenCalledWith('Veuillez vous connecter pour ajouter des produits au panier');
  });

  it('should update cart quantity', () => {
    const productId = 1;
    const quantity = 5;

    component.updateCartQuantity(productId, quantity);
    expect(cartServiceSpy.updateCartItemQuantity).toHaveBeenCalledWith(productId, quantity);
  });

  it('should remove from cart when quantity is 0', () => {
    const productId = 1;
    const quantity = 0;

    component.updateCartQuantity(productId, quantity);
    expect(cartServiceSpy.removeFromCart).toHaveBeenCalledWith(productId);
  });

  it('should remove from cart', () => {
    const productId = 1;

    component.removeFromCart(productId);
    expect(cartServiceSpy.removeFromCart).toHaveBeenCalledWith(productId);
  });

  it('should toggle wishlist status', () => {
    authServiceSpy.isLoggedIn.and.returnValue(true);
    const productId = 1;

    component.wishlistItems[productId] = false;
    component.toggleWishlist(productId);
    expect(wishlistServiceSpy.addToWishlist).toHaveBeenCalledWith(productId);

    component.wishlistItems[productId] = true;
    component.toggleWishlist(productId);
    expect(wishlistServiceSpy.removeFromWishlist).toHaveBeenCalledWith(productId);
  });

  it('should show alert when not logged in and trying to add to wishlist', () => {
    authServiceSpy.isLoggedIn.and.returnValue(false);
    spyOn(window, 'alert');

    component.toggleWishlist(1);
    expect(window.alert).toHaveBeenCalledWith('Veuillez vous connecter pour ajouter des produits à votre liste d'envies');
  });

  it('should return correct inventory status class', () => {
    expect(component.getInventoryStatusClass('INSTOCK')).toBe('status-instock');
    expect(component.getInventoryStatusClass('LOWSTOCK')).toBe('status-lowstock');
    expect(component.getInventoryStatusClass('OUTOFSTOCK')).toBe('status-outofstock');
  });

  it('should return correct inventory status text', () => {
    expect(component.getInventoryStatusText('INSTOCK')).toBe('En stock');
    expect(component.getInventoryStatusText('LOWSTOCK')).toBe('Stock limité');
    expect(component.getInventoryStatusText('OUTOFSTOCK')).toBe('Rupture de stock');
  });
});
