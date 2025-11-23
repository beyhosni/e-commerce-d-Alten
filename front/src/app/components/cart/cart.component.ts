import { Component, inject } from '@angular/core';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent {
  private cartService = inject(CartService);

  cartItems = this.cartService.getCartItems();
  totalAmount = this.cartService.cartTotal;
  cartCount = this.cartService.cartCount;

  constructor() { }

  updateQuantity(productId: number, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity);
  }

  removeItem(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  checkout(): void {
    alert('Fonctionnalité de paiement à implémenter');
  }

  clearCart(): void {
    if (confirm('Êtes-vous sûr de vouloir vider votre panier?')) {
      this.cartService.clearCart();
    }
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
