import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductService, Product, ProductFilters } from './product.service';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

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
      quantity: 25,
      internalReference: 'REF-LU-002',
      shellId: 2,
      inventoryStatus: 'LOWSTOCK',
      rating: 4,
      createdAt: 1625097600000,
      updatedAt: 1625184000000
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService]
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getProducts', () => {
    it('should return all products without filters', () => {
      service.getProducts().subscribe(products => {
        expect(products).toEqual(mockProducts);
      });

      const req = httpMock.expectOne('http://localhost:8080/api/products');
      expect(req.request.method).toBe('GET');
      req.flush(mockProducts);
    });

    it('should send category filter when provided', () => {
      const filters: ProductFilters = { category: 'Électronique' };

      service.getProducts(filters).subscribe();

      const req = httpMock.expectOne(request => 
        request.url.includes('category=Électronique')
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockProducts);
    });

    it('should send status filter when provided', () => {
      const filters: ProductFilters = { status: 'INSTOCK' };

      service.getProducts(filters).subscribe();

      const req = httpMock.expectOne(request => 
        request.url.includes('status=INSTOCK')
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockProducts);
    });

    it('should send pagination parameters when provided', () => {
      const filters: ProductFilters = { page: 1, size: 10 };

      service.getProducts(filters).subscribe();

      const req = httpMock.expectOne(request => 
        request.url.includes('page=1') && request.url.includes('size=10')
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockProducts);
    });
  });

  describe('getProduct', () => {
    it('should return a single product by ID', () => {
      const productId = 1;
      const expectedProduct = mockProducts[0];

      service.getProduct(productId).subscribe(product => {
        expect(product).toEqual(expectedProduct);
      });

      const req = httpMock.expectOne(`http://localhost:8080/api/products/${productId}`);
      expect(req.request.method).toBe('GET');
      req.flush(expectedProduct);
    });
  });

  describe('createProduct', () => {
    it('should create a new product', () => {
      const newProduct: Product = {
        id: 0,
        code: 'P003',
        name: 'Nouveau Produit',
        description: 'Description du nouveau produit',
        image: 'https://example.com/image3.jpg',
        category: 'Catégorie',
        price: 99.99,
        quantity: 10,
        internalReference: 'REF-NEW',
        shellId: 3,
        inventoryStatus: 'INSTOCK',
        rating: 5,
        createdAt: 0,
        updatedAt: 0
      };

      service.createProduct(newProduct).subscribe(product => {
        expect(product).toEqual(newProduct);
      });

      const req = httpMock.expectOne('http://localhost:8080/api/products');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newProduct);
      req.flush(newProduct);
    });
  });

  describe('updateProduct', () => {
    it('should update an existing product', () => {
      const productId = 1;
      const updatedProduct = { ...mockProducts[0], name: 'Produit mis à jour' };

      service.updateProduct(productId, updatedProduct).subscribe(product => {
        expect(product.name).toBe('Produit mis à jour');
      });

      const req = httpMock.expectOne(`http://localhost:8080/api/products/${productId}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedProduct);
      req.flush(updatedProduct);
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product by ID', () => {
      const productId = 1;

      service.deleteProduct(productId).subscribe();

      const req = httpMock.expectOne(`http://localhost:8080/api/products/${productId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });

  describe('getProductsByCategory', () => {
    it('should return products filtered by category', () => {
      const category = 'Électronique';
      const expectedProducts = mockProducts.filter(p => p.category === category);

      service.getProductsByCategory(category).subscribe(products => {
        expect(products).toEqual(expectedProducts);
      });

      const req = httpMock.expectOne(`http://localhost:8080/api/products/category/${category}`);
      expect(req.request.method).toBe('GET');
      req.flush(expectedProducts);
    });
  });

  describe('getProductsByStatus', () => {
    it('should return products filtered by inventory status', () => {
      const status = 'INSTOCK';
      const expectedProducts = mockProducts.filter(p => p.inventoryStatus === status);

      service.getProductsByStatus(status).subscribe(products => {
        expect(products).toEqual(expectedProducts);
      });

      const req = httpMock.expectOne(`http://localhost:8080/api/products/status/${status}`);
      expect(req.request.method).toBe('GET');
      req.flush(expectedProducts);
    });
  });
});
