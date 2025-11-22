import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { of } from 'rxjs';
import { CartComponent } from './cart.component';
import { CartService, CartItem } from '../../services/cart.service';
import { ProductService, Product } from '../../services/product.service';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

describe('CartComponent Integration Tests', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
  let cartService: CartService;
  let productService: ProductService;

  const mockProduct: Product = {
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
  };

  const mockCartItems: CartItem[] = [
    {
      id: 1,
      userId: 1,
      product: mockProduct,
      quantity: 2,
      createdAt: 1625097600000,
      updatedAt: 1625184000000
    },
    {
      id: 2,
      userId: 1,
      product: { ...mockProduct, id: 2, name: 'Laptop Ultra', price: 1299.99 },
      quantity: 1,
      createdAt: 1625097600000,
      updatedAt: 1625184000000
    }
  ];

  beforeEach(async () => {
    const cartServiceSpy = jasmine.createSpyObj('CartService', ['getCart', 'updateCartItemQuantity', 'removeFromCart']);
    const productServiceSpy = jasmine.createSpyObj('ProductService', []);

    await TestBed.configureTestingModule({
      imports: [
        ButtonModule,
        InputNumberModule,
        TableModule,
        TagModule
      ],
      declarations: [CartComponent],
      providers: [
        { provide: CartService, useValue: cartServiceSpy },
        { provide: ProductService, useValue: productServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    cartService = TestBed.inject(CartService);
    productService = TestBed.inject(ProductService);

    // Configuration par défaut des espions
    (cartService.getCart as jasmine.Spy).and.returnValue(of(mockCartItems));

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display cart items', () => {
    const cartRows = fixture.debugElement.queryAll(By.css('p-table .p-datatable-tbody tr'));
    expect(cartRows.length).toBe(mockCartItems.length);
  });

  it('should display product details correctly', () => {
    const firstCartRow = fixture.debugElement.query(By.css('p-table .p-datatable-tbody tr:first-child'));
    const productName = firstCartRow.query(By.css('.product-name')).nativeElement.textContent;
    const productPrice = firstCartRow.query(By.css('.product-price')).nativeElement.textContent;
    const productQuantity = firstCartRow.query(By.css('.product-quantity')).nativeElement;

    expect(productName).toContain(mockCartItems[0].product.name);
    expect(productPrice).toContain(mockCartItems[0].product.price.toString());
    expect(productQuantity.value).toBe(mockCartItems[0].quantity);
  });

  it('should calculate total amount correctly', () => {
    const totalElement = fixture.debugElement.query(By.css('.cart-total')).nativeElement;
    const expectedTotal = mockCartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);

    expect(totalElement.textContent).toContain(expectedTotal.toString());
  });

  it('should update item quantity', () => {
    const firstCartRow = fixture.debugElement.query(By.css('p-table .p-datatable-tbody tr:first-child'));
    const quantityInput = firstCartRow.query(By.css('.product-quantity'));
    const newQuantity = 5;

    (cartService.updateCartItemQuantity as jasmine.Spy).and.returnValue(of({}));

    quantityInput.nativeElement.value = newQuantity;
    quantityInput.nativeElement.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(cartService.updateCartItemQuantity).toHaveBeenCalledWith(mockCartItems[0].product.id, newQuantity);
  });

  it('should remove item from cart', () => {
    const firstCartRow = fixture.debugElement.query(By.css('p-table .p-datatable-tbody tr:first-child'));
    const removeButton = firstCartRow.query(By.css('.remove-button'));

    (cartService.removeFromCart as jasmine.Spy).and.returnValue(of({}));

    removeButton.nativeElement.click();
    fixture.detectChanges();

    expect(cartService.removeFromCart).toHaveBeenCalledWith(mockCartItems[0].product.id);
  });

  it('should display checkout button', () => {
    const checkoutButton = fixture.debugElement.query(By.css('.checkout-button'));
    expect(checkoutButton).toBeTruthy();
  });

  it('should display clear cart button', () => {
    const clearCartButton = fixture.debugElement.query(By.css('.clear-cart-button'));
    expect(clearCartButton).toBeTruthy();
  });

  it('should show alert on checkout', () => {
    const checkoutButton = fixture.debugElement.query(By.css('.checkout-button'));
    spyOn(window, 'alert');

    checkoutButton.nativeElement.click();

    expect(window.alert).toHaveBeenCalledWith('Fonctionnalité de paiement à implémenter');
  });

  it('should show confirmation and alert on clear cart when confirmed', () => {
    const clearCartButton = fixture.debugElement.query(By.css('.clear-cart-button'));
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(window, 'alert');

    clearCartButton.nativeElement.click();

    expect(window.confirm).toHaveBeenCalledWith('Êtes-vous sûr de vouloir vider votre panier?');
    expect(window.alert).toHaveBeenCalledWith('Fonctionnalité à implémenter');
  });

  it('should not show alert on clear cart when cancelled', () => {
    const clearCartButton = fixture.debugElement.query(By.css('.clear-cart-button'));
    spyOn(window, 'confirm').and.returnValue(false);
    spyOn(window, 'alert');

    clearCartButton.nativeElement.click();

    expect(window.confirm).toHaveBeenCalledWith('Êtes-vous sûr de vouloir vider votre panier?');
    expect(window.alert).not.toHaveBeenCalledWith('Fonctionnalité à implémenter');
  });

  it('should display correct inventory status', () => {
    const firstCartRow = fixture.debugElement.query(By.css('p-table .p-datatable-tbody tr:first-child'));
    const statusElement = firstCartRow.query(By.css('.inventory-status'));
    const statusClass = statusElement.nativeElement.className;
    const statusText = statusElement.nativeElement.textContent;

    expect(statusClass).toContain('status-instock');
    expect(statusText).toContain('En stock');
  });
});
