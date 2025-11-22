import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { CartComponent } from './cart.component';
import { CartService, CartItem } from '../../services/cart.service';
import { ProductService, Product } from '../../services/product.service';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
  let cartServiceSpy: jasmine.SpyObj<CartService>;
  let productServiceSpy: jasmine.SpyObj<ProductService>;

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
    cartServiceSpy = jasmine.createSpyObj('CartService', ['getCart', 'updateCartItemQuantity', 'removeFromCart']);
    productServiceSpy = jasmine.createSpyObj('ProductService', []);

    await TestBed.configureTestingModule({
      declarations: [CartComponent],
      providers: [
        { provide: CartService, useValue: cartServiceSpy },
        { provide: ProductService, useValue: productServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load cart items on init', () => {
    cartServiceSpy.getCart.and.returnValue(of(mockCartItems));
    component.ngOnInit();
    fixture.detectChanges();

    expect(cartServiceSpy.getCart).toHaveBeenCalled();
    expect(component.cartItems).toEqual(mockCartItems);
    expect(component.loading).toBe(false);
  });

  it('should calculate total correctly', () => {
    cartServiceSpy.getCart.and.returnValue(of(mockCartItems));
    component.ngOnInit();
    fixture.detectChanges();

    // (899.99 * 2) + (1299.99 * 1) = 3099.97
    expect(component.totalAmount).toBe(3099.97);
  });

  it('should update item quantity', () => {
    const productId = 1;
    const newQuantity = 5;
    const updatedItem = { ...mockCartItems[0], quantity: newQuantity };

    cartServiceSpy.updateCartItemQuantity.and.returnValue(of(updatedItem));
    component.updateQuantity(productId, newQuantity);
    fixture.detectChanges();

    expect(cartServiceSpy.updateCartItemQuantity).toHaveBeenCalledWith(productId, newQuantity);
    expect(component.cartItems.find(item => item.product.id === productId)?.quantity).toBe(newQuantity);
  });

  it('should remove item when quantity is 0', () => {
    const productId = 1;
    const zeroQuantity = 0;

    spyOn(component, 'removeItem');
    component.updateQuantity(productId, zeroQuantity);

    expect(component.removeItem).toHaveBeenCalledWith(productId);
  });

  it('should remove item from cart', () => {
    const productId = 1;
    const filteredItems = mockCartItems.filter(item => item.product.id !== productId);

    cartServiceSpy.removeFromCart.and.returnValue(of(null));
    component.removeItem(productId);
    fixture.detectChanges();

    expect(cartServiceSpy.removeFromCart).toHaveBeenCalledWith(productId);
    expect(component.cartItems).toEqual(filteredItems);
  });

  it('should recalculate total after removing item', () => {
    cartServiceSpy.getCart.and.returnValue(of(mockCartItems));
    component.ngOnInit();
    fixture.detectChanges();

    const initialTotal = component.totalAmount;
    const productId = 1;
    const removedItem = mockCartItems.find(item => item.product.id === productId);
    const expectedNewTotal = initialTotal - (removedItem?.product.price! * removedItem?.quantity!);

    cartServiceSpy.removeFromCart.and.returnValue(of(null));
    component.removeItem(productId);
    fixture.detectChanges();

    expect(component.totalAmount).toBe(expectedNewTotal);
  });

  it('should show alert on checkout', () => {
    spyOn(window, 'alert');
    component.checkout();
    expect(window.alert).toHaveBeenCalledWith('Fonctionnalité de paiement à implémenter');
  });

  it('should handle cart service errors', () => {
    cartServiceSpy.getCart.and.returnValue(throwError('Error loading cart'));
    component.ngOnInit();
    fixture.detectChanges();

    spyOn(window, 'alert');
    // Simuler un clic sur le bouton supprimer
    component.removeItem(1);
    expect(window.alert).toHaveBeenCalledWith('Erreur lors de la suppression du panier');
  });
});
