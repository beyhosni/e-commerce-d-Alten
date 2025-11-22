import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CartService, CartItem } from './cart.service';
import { Product } from './product.service';

describe('CartService', () => {
  let service: CartService;
  let httpMock: HttpTestingController;

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
      product: { ...mockProduct, id: 2, name: 'Laptop Ultra' },
      quantity: 1,
      createdAt: 1625097600000,
      updatedAt: 1625184000000
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CartService]
    });
    service = TestBed.inject(CartService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getCart', () => {
    it('should return cart items', () => {
      service.getCart().subscribe(items => {
        expect(items).toEqual(mockCartItems);
      });

      const req = httpMock.expectOne('http://localhost:8080/api/cart');
      expect(req.request.method).toBe('GET');
      req.flush(mockCartItems);
    });
  });

  describe('addToCart', () => {
    it('should add a product to cart', () => {
      const productId = 3;
      const quantity = 1;
      const expectedNewItem: CartItem = {
        id: 3,
        userId: 1,
        product: { ...mockProduct, id: 3 },
        quantity: 1,
        createdAt: 1625097600000,
        updatedAt: 1625184000000
      };

      service.addToCart(productId, quantity).subscribe(item => {
        expect(item).toEqual(expectedNewItem);
      });

      const req = httpMock.expectOne(`http://localhost:8080/api/cart?productId=${productId}&quantity=${quantity}`);
      expect(req.request.method).toBe('POST');
      req.flush(expectedNewItem);
    });
  });

  describe('removeFromCart', () => {
    it('should remove a product from cart', () => {
      const productId = 1;

      service.removeFromCart(productId).subscribe();

      const req = httpMock.expectOne(`http://localhost:8080/api/cart?productId=${productId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });

  describe('updateCartItemQuantity', () => {
    it('should update quantity of a cart item', () => {
      const productId = 1;
      const newQuantity = 5;
      const updatedItem: CartItem = {
        ...mockCartItems[0],
        quantity: newQuantity
      };

      service.updateCartItemQuantity(productId, newQuantity).subscribe(item => {
        expect(item.quantity).toBe(newQuantity);
      });

      const req = httpMock.expectOne(`http://localhost:8080/api/cart?productId=${productId}&quantity=${newQuantity}`);
      expect(req.request.method).toBe('PUT');
      req.flush(updatedItem);
    });
  });

  describe('getCartItemCount', () => {
    it('should calculate total number of items in cart', () => {
      service.getCartItemCount().subscribe(count => {
        expect(count).toBe(3); // 2 + 1 from mock data
      });

      const req = httpMock.expectOne('http://localhost:8080/api/cart');
      expect(req.request.method).toBe('GET');
      req.flush(mockCartItems);
    });

    it('should return 0 when cart is empty', () => {
      service.getCartItemCount().subscribe(count => {
        expect(count).toBe(0);
      });

      const req = httpMock.expectOne('http://localhost:8080/api/cart');
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });
  });
});
