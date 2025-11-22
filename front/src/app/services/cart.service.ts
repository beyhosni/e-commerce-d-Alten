import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Product } from './product.service';

export interface CartItem {
  id: number;
  userId: number;
  product: Product;
  quantity: number;
  createdAt: number;
  updatedAt: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:8080/api/cart';

  constructor(private http: HttpClient) { }

  getCart(): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(this.apiUrl);
  }

  addToCart(productId: number, quantity: number): Observable<CartItem> {
    return this.http.post<CartItem>(`${this.apiUrl}?productId=${productId}&quantity=${quantity}`, {});
  }

  removeFromCart(productId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}?productId=${productId}`);
  }

  updateCartItemQuantity(productId: number, quantity: number): Observable<CartItem> {
    return this.http.put<CartItem>(`${this.apiUrl}?productId=${productId}&quantity=${quantity}`, {});
  }

  getCartItemCount(): Observable<number> {
    return new Observable<number>(observer => {
      this.getCart().subscribe(items => {
        const count = items.reduce((total, item) => total + item.quantity, 0);
        observer.next(count);
        observer.complete();
      }, error => {
        observer.error(error);
      });
    });
  }

  private cartItemCountSubject = new BehaviorSubject<number>(0);
  cartItemCount$ = this.cartItemCountSubject.asObservable();

  updateCartBadge(count: number): void {
    this.cartItemCountSubject.next(count);
  }
}
