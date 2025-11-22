import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { WishlistService, WishlistItem } from './wishlist.service';
import { Product } from './product.service';

describe('WishlistService', () => {
  let service: WishlistService;
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

  const mockWishlistItems: WishlistItem[] = [
    {
      id: 1,
      userId: 1,
      product: mockProduct,
      createdAt: 1625097600000
    },
    {
      id: 2,
      userId: 1,
      product: { ...mockProduct, id: 2, name: 'Laptop Ultra' },
      createdAt: 1625097600000
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WishlistService]
    });
    service = TestBed.inject(WishlistService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getWishlist', () => {
    it('should return wishlist items', () => {
      service.getWishlist().subscribe(items => {
        expect(items).toEqual(mockWishlistItems);
      });

      const req = httpMock.expectOne('http://localhost:8080/api/wishlist');
      expect(req.request.method).toBe('GET');
      req.flush(mockWishlistItems);
    });
  });

  describe('addToWishlist', () => {
    it('should add a product to wishlist', () => {
      const productId = 3;
      const expectedNewItem: WishlistItem = {
        id: 3,
        userId: 1,
        product: { ...mockProduct, id: 3 },
        createdAt: 1625097600000
      };

      service.addToWishlist(productId).subscribe(item => {
        expect(item).toEqual(expectedNewItem);
      });

      const req = httpMock.expectOne(`http://localhost:8080/api/wishlist?productId=${productId}`);
      expect(req.request.method).toBe('POST');
      req.flush(expectedNewItem);
    });
  });

  describe('removeFromWishlist', () => {
    it('should remove a product from wishlist', () => {
      const productId = 1;

      service.removeFromWishlist(productId).subscribe();

      const req = httpMock.expectOne(`http://localhost:8080/api/wishlist?productId=${productId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });

  describe('isInWishlist', () => {
    it('should return true if product is in wishlist', () => {
      const productId = 1; // Présent dans mockWishlistItems

      service.isInWishlist(productId).subscribe(isInWishlist => {
        expect(isInWishlist).toBe(true);
      });

      const req = httpMock.expectOne('http://localhost:8080/api/wishlist');
      expect(req.request.method).toBe('GET');
      req.flush(mockWishlistItems);
    });

    it('should return false if product is not in wishlist', () => {
      const productId = 999; // Non présent dans mockWishlistItems

      service.isInWishlist(productId).subscribe(isInWishlist => {
        expect(isInWishlist).toBe(false);
      });

      const req = httpMock.expectOne('http://localhost:8080/api/wishlist');
      expect(req.request.method).toBe('GET');
      req.flush(mockWishlistItems);
    });

    it('should handle error when checking if product is in wishlist', () => {
      const productId = 1;

      service.isInWishlist(productId).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => expect(error).toBeTruthy()
      });

      const req = httpMock.expectOne('http://localhost:8080/api/wishlist');
      expect(req.request.method).toBe('GET');
      req.flush('Error', { status: 500, statusText: 'Server Error' });
    });
  });
});
