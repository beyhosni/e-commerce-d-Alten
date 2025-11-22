import { Component, OnInit } from '@angular/core';
import { Product, ProductService, ProductFilters } from '../../services/product.service';
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

  // Pagination
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 0;
  displayNextButton = true;

  // Carte des produits dans le panier
  cartQuantities: { [key: number]: number } = {};

  // Carte des produits dans la liste d'envies
  wishlistItems: { [key: number]: boolean } = {};

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts().subscribe(products => {
      this.products = products;
      this.filteredProducts = [...products];
      this.extractCategories();
      this.initializeCartQuantities();
      this.initializeWishlistItems();
      this.calculateTotalPages();
      this.loading = false;
    });
  }

  extractCategories(): void {
    this.categories = [...new Set(this.products.map(product => product.category))];
  }

  initializeCartQuantities(): void {
    if (this.authService.isLoggedIn()) {
      this.cartService.getCart().subscribe(cartItems => {
        cartItems.forEach(item => {
          this.cartQuantities[item.product.id] = item.quantity;
        });
      });
    }
  }

  initializeWishlistItems(): void {
    if (this.authService.isLoggedIn()) {
      this.wishlistService.getWishlist().subscribe(wishlistItems => {
        wishlistItems.forEach(item => {
          this.wishlistItems[item.product.id] = true;
        });
      });
    }
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

    this.currentPage = 1;
    this.calculateTotalPages();
  }

  clearFilters(): void {
    this.selectedCategory = '';
    this.selectedStatus = '';
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

  addToCart(productId: number, quantity: number = 1): void {
    if (!this.authService.isLoggedIn()) {
      alert('Veuillez vous connecter pour ajouter des produits au panier');
      return;
    }

    this.cartService.addToCart(productId, quantity).subscribe({
      next: (cartItem) => {
        this.cartQuantities[productId] = (this.cartQuantities[productId] || 0) + quantity;
        this.cartService.getCartItemCount().subscribe(count => {
          // Émettre un événement pour mettre à jour le badge du panier
          this.cartService.updateCartBadge(count);
        });
        alert('Produit ajouté au panier avec succès');
      },
      error: (error) => {
        console.error('Erreur lors de l\'ajout au panier:', error);
        alert('Erreur lors de l\'ajout au panier');
      }
    });
  }

  updateCartQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    this.cartService.updateCartItemQuantity(productId, quantity).subscribe({
      next: (cartItem) => {
        this.cartQuantities[productId] = quantity;
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour du panier:', error);
        alert('Erreur lors de la mise à jour du panier');
      }
    });
  }

  removeFromCart(productId: number): void {
    this.cartService.removeFromCart(productId).subscribe({
      next: () => {
        this.cartQuantities[productId] = 0;
      },
      error: (error) => {
        console.error('Erreur lors de la suppression du panier:', error);
        alert('Erreur lors de la suppression du panier');
      }
    });
  }

  toggleWishlist(productId: number): void {
    if (!this.authService.isLoggedIn()) {
      alert('Veuillez vous connecter pour ajouter des produits à votre liste d\'envies');
      return;
    }

    if (this.wishlistItems[productId]) {
      this.wishlistService.removeFromWishlist(productId).subscribe({
        next: () => {
          this.wishlistItems[productId] = false;
        },
        error: (error) => {
          console.error('Erreur lors de la suppression de la liste d\'envies:', error);
          alert('Erreur lors de la suppression de la liste d\'envies');
        }
      });
    } else {
      this.wishlistService.addToWishlist(productId).subscribe({
        next: () => {
          this.wishlistItems[productId] = true;
        },
        error: (error) => {
          console.error('Erreur lors de l\'ajout à la liste d\'envies:', error);
          alert('Erreur lors de l\'ajout à la liste d\'envies');
        }
      });
    }
  }

  getInventoryStatusClass(status: string): string {
    switch (status) {
      case 'INSTOCK':
        return 'status-instock';
      case 'LOWSTOCK':
        return 'status-lowstock';
      case 'OUTOFSTOCK':
        return 'status-outofstock';
      default:
        return '';
    }
  }

  getInventoryStatusText(status: string): string {
    switch (status) {
      case 'INSTOCK':
        return 'En stock';
      case 'LOWSTOCK':
        return 'Stock limité';
      case 'OUTOFSTOCK':
        return 'Rupture de stock';
      default:
        return status;
    }
  }
}
