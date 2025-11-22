import { Component, OnInit } from '@angular/core';
import { CartItem, CartService } from '../../services/cart.service';
import { ProductService, Product } from '../../services/product.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  loading = true;
  totalAmount = 0;

  constructor(
    private cartService: CartService,
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.loading = true;
    this.cartService.getCart().subscribe(items => {
      this.cartItems = items;
      this.calculateTotal();
      this.loading = false;
    });
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }

    this.cartService.updateCartItemQuantity(productId, quantity).subscribe({
      next: (cartItem) => {
        const item = this.cartItems.find(item => item.product.id === productId);
        if (item) {
          item.quantity = quantity;
          this.calculateTotal();
        }
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour du panier:', error);
        alert('Erreur lors de la mise à jour du panier');
      }
    });
  }

  removeItem(productId: number): void {
    this.cartService.removeFromCart(productId).subscribe({
      next: () => {
        this.cartItems = this.cartItems.filter(item => item.product.id !== productId);
        this.calculateTotal();
      },
      error: (error) => {
        console.error('Erreur lors de la suppression du panier:', error);
        alert('Erreur lors de la suppression du panier');
      }
    });
  }

  calculateTotal(): void {
    this.totalAmount = this.cartItems.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  }

  checkout(): void {
    alert('Fonctionnalité de paiement à implémenter');
  }

  clearCart(): void {
    if (confirm('Êtes-vous sûr de vouloir vider votre panier?')) {
      // Implémenter la méthode pour vider le panier
      alert('Fonctionnalité à implémenter');
    }
  }

  getCartItemCount(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
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
