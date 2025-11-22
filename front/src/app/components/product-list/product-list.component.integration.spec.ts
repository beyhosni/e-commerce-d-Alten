import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { of } from 'rxjs';
import { ProductListComponent } from './product-list.component';
import { ProductService, Product } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { AuthService } from '../../services/auth.service';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { PaginatorModule } from 'primeng/paginator';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';

describe('ProductListComponent Integration Tests', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productService: ProductService;
  let cartService: CartService;
  let wishlistService: WishlistService;
  let authService: AuthService;

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
    }
  ];

  beforeEach(async () => {
    const productServiceSpy = jasmine.createSpyObj('ProductService', ['getProducts']);
    const cartServiceSpy = jasmine.createSpyObj('CartService', ['getCart', 'addToCart', 'updateCartItemQuantity', 'removeFromCart', 'getCartItemCount', 'updateCartBadge']);
    const wishlistServiceSpy = jasmine.createSpyObj('WishlistService', ['getWishlist', 'addToWishlist', 'removeFromWishlist']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn']);

    await TestBed.configureTestingModule({
      imports: [
        ButtonModule,
        DropdownModule,
        PaginatorModule,
        CardModule,
        TagModule
      ],
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
    productService = TestBed.inject(ProductService);
    cartService = TestBed.inject(CartService);
    wishlistService = TestBed.inject(WishlistService);
    authService = TestBed.inject(AuthService);

    // Configuration par défaut des espions
    (productService.getProducts as jasmine.Spy).and.returnValue(of(mockProducts));
    (authService.isLoggedIn as jasmine.Spy).and.returnValue(true);
    (cartService.getCart as jasmine.Spy).and.returnValue(of([]));
    (cartService.getCartItemCount as jasmine.Spy).and.returnValue(of(0));
    (wishlistService.getWishlist as jasmine.Spy).and.returnValue(of([]));

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display product list', () => {
    const productCards = fixture.debugElement.queryAll(By.css('.product-card'));
    expect(productCards.length).toBe(mockProducts.length);
  });

  it('should display product details correctly', () => {
    const firstProductCard = fixture.debugElement.query(By.css('.product-card'));
    const productName = firstProductCard.query(By.css('.product-name')).nativeElement.textContent;
    const productPrice = firstProductCard.query(By.css('.product-price')).nativeElement.textContent;
    const productCategory = firstProductCard.query(By.css('.product-category')).nativeElement.textContent;

    expect(productName).toContain(mockProducts[0].name);
    expect(productPrice).toContain(mockProducts[0].price.toString());
    expect(productCategory).toContain(mockProducts[0].category);
  });

  it('should display category filter', () => {
    const categoryFilter = fixture.debugElement.query(By.css('#category-filter'));
    expect(categoryFilter).toBeTruthy();
  });

  it('should display status filter', () => {
    const statusFilter = fixture.debugElement.query(By.css('#status-filter'));
    expect(statusFilter).toBeTruthy();
  });

  it('should display pagination', () => {
    const paginator = fixture.debugElement.query(By.css('p-paginator'));
    expect(paginator).toBeTruthy();
  });

  it('should filter products by category', () => {
    const categoryFilter = fixture.debugElement.query(By.css('#category-filter'));
    categoryFilter.nativeElement.value = 'Électronique';
    categoryFilter.nativeElement.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(component.selectedCategory).toBe('Électronique');
    expect(component.filteredProducts.length).toBe(1);
    expect(component.filteredProducts[0].category).toBe('Électronique');
  });

  it('should filter products by status', () => {
    const statusFilter = fixture.debugElement.query(By.css('#status-filter'));
    statusFilter.nativeElement.value = 'INSTOCK';
    statusFilter.nativeElement.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(component.selectedStatus).toBe('INSTOCK');
    expect(component.filteredProducts.length).toBe(1);
    expect(component.filteredProducts[0].inventoryStatus).toBe('INSTOCK');
  });

  it('should clear filters', () => {
    const clearFiltersButton = fixture.debugElement.query(By.css('#clear-filters'));

    component.selectedCategory = 'Électronique';
    component.selectedStatus = 'INSTOCK';
    component.applyFilters();
    fixture.detectChanges();

    clearFiltersButton.nativeElement.click();
    fixture.detectChanges();

    expect(component.selectedCategory).toBe('');
    expect(component.selectedStatus).toBe('');
    expect(component.filteredProducts.length).toBe(mockProducts.length);
  });

  it('should display add to cart button when user is logged in', () => {
    const addToCartButtons = fixture.debugElement.queryAll(By.css('.add-to-cart'));
    expect(addToCartButtons.length).toBe(mockProducts.length);
  });

  it('should not display add to cart button when user is not logged in', () => {
    (authService.isLoggedIn as jasmine.Spy).and.returnValue(false);
    fixture.detectChanges();

    const addToCartButtons = fixture.debugElement.queryAll(By.css('.add-to-cart'));
    expect(addToCartButtons.length).toBe(0);
  });

  it('should display wishlist button when user is logged in', () => {
    const wishlistButtons = fixture.debugElement.queryAll(By.css('.wishlist-button'));
    expect(wishlistButtons.length).toBe(mockProducts.length);
  });

  it('should not display wishlist button when user is not logged in', () => {
    (authService.isLoggedIn as jasmine.Spy).and.returnValue(false);
    fixture.detectChanges();

    const wishlistButtons = fixture.debugElement.queryAll(By.css('.wishlist-button'));
    expect(wishlistButtons.length).toBe(0);
  });

  it('should display correct inventory status', () => {
    const firstProductCard = fixture.debugElement.query(By.css('.product-card'));
    const statusElement = firstProductCard.query(By.css('.inventory-status'));
    const statusClass = statusElement.nativeElement.className;
    const statusText = statusElement.nativeElement.textContent;

    expect(statusClass).toContain('status-instock');
    expect(statusText).toContain('En stock');
  });
});
