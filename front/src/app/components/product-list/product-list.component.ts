import { Component, OnInit, computed, inject } from '@angular/core';
import { Product, ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  loading = true;

  // Filtres
  categories: string[] = [];
  selectedCategory: string = '';
  selectedStatus: string = '';
  selectedSort: string = '';

  // Pagination
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 0;

  // Services
  private cartService = inject(CartService);
  private productService = inject(ProductService);
  private wishlistService = inject(WishlistService); // Keep for now, though might need refactor if wishlist is also broken
  // private authService = inject(AuthService); // Removing auth check for cart as per requirements usually implies open cart or mock auth

  // Signals helpers
  cartItems = this.cartService.getCartItems();

  // Carte des produits dans la liste d'envies (Legacy behavior kept for now)
  wishlistItems: { [key: number]: boolean } = {};

  constructor() { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts().subscribe(products => {
      this.products = products;
      this.filteredProducts = [...products];
      this.extractCategories();
      this.calculateTotalPages();
      this.loading = false;
    });
  }

  extractCategories(): void {
    this.categories = [...new Set(this.products.map(product => product.category))];
  }

  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
  }

  applyFilters(): void {
    this.filteredProducts = this.products.filter(product => {
      const categoryMatch = !this.selectedCategory || product.category === this.selectedCategory;
      const statusMatch = !this.selectedStatus || product.inventoryStatus === this.selectedStatus;
      return categoryMatch && statusMatch;
    });

    if (this.selectedSort) {
      this.sortProducts();
    }

    this.currentPage = 1;
    this.calculateTotalPages();
  }

  sortProducts(): void {
    switch (this.selectedSort) {
      case 'price-asc':
        this.filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        this.filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        this.filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        this.filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
    }
  }

  clearFilters(): void {
    this.selectedCategory = '';
    this.selectedStatus = '';
    this.selectedSort = '';
    this.filteredProducts = [...this.products];
    this.currentPage = 1;
    this.calculateTotalPages();
  }

  get paginatedProducts(): Product[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredProducts.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // Cart Actions
  addToCart(product: Product): void {
    this.cartService.addToCart(product);
  }

  removeFromCart(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  updateCartQuantity(productId: number, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity);
  }

  getProductQuantity(productId: number): number {
    const item = this.cartItems().find(i => i.product.id === productId);
    return item ? item.quantity : 0;
  }

  // Wishlist (Mocked behavior for now to avoid errors if service is broken)
  toggleWishlist(productId: number): void {
    this.wishlistItems[productId] = !this.wishlistItems[productId];
  }

  getInventoryStatusClass(status: string): string {
    switch (status) {
      case 'INSTOCK': return 'status-instock';
      case 'LOWSTOCK': return 'status-lowstock';
      case 'OUTOFSTOCK': return 'status-outofstock';
      default: return '';
    }
  }

  getInventoryStatusText(status: string): string {
    switch (status) {
      case 'INSTOCK': return 'En stock';
      case 'LOWSTOCK': return 'Stock limité';
      case 'OUTOFSTOCK': return 'Rupture de stock';
      default: return status;
    }
  }
}
