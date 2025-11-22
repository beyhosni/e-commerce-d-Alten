import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from './product.service';

export interface WishlistItem {
  id: number;
  userId: number;
  product: Product;
  createdAt: number;
}

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private apiUrl = 'http://localhost:8080/api/wishlist';

  constructor(private http: HttpClient) { }

  getWishlist(): Observable<WishlistItem[]> {
    return this.http.get<WishlistItem[]>(this.apiUrl);
  }

  addToWishlist(productId: number): Observable<WishlistItem> {
    return this.http.post<WishlistItem>(`${this.apiUrl}?productId=${productId}`, {});
  }

  removeFromWishlist(productId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}?productId=${productId}`);
  }

  isInWishlist(productId: number): Observable<boolean> {
    return new Observable<boolean>(observer => {
      this.getWishlist().subscribe(items => {
        const isInWishlist = items.some(item => item.product.id === productId);
        observer.next(isInWishlist);
        observer.complete();
      }, error => {
        observer.error(error);
      });
    });
  }
}
