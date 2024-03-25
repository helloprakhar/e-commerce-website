import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Cart, CartItem } from '../models/cart';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = environment.apiURL + 'cart';

  cart$: BehaviorSubject<Cart> = new BehaviorSubject(this.getCart());

  constructor(private http: HttpClient) {
    this.initCartLocalStorage();
  }

  initCartLocalStorage() {
    const cart: Cart = this.getCart();

    if (!cart) {
      const initialCart = {
        cartItems: [],
        user: {}
      };
      const initialCartJson = JSON.stringify(initialCart);
      localStorage.setItem('cart', initialCartJson);
    }
  }

  getCart(): Cart {
    const cartJsonString: string = localStorage.getItem('cart');
    const cart: Cart = JSON.parse(cartJsonString);

    return cart;
  }
  setCartItem(cartItem: CartItem) {
    const cart = this.getCart();

    const cartItemExist = cart.cartItems.find(
      (item) => item.item._id === cartItem.item._id
    );

    if (cartItemExist) {
      cart.cartItems.map((item) => {
        if (item.item._id === cartItem.item._id) {
          item.quantity = item.quantity + cartItem.quantity;
        }
      });
    } else {
      const user = localStorage.getItem('user');
      cart.cartItems.push(cartItem);
      cart.user = user;
      cart.timestamp = new Date(); 
      this.updateLocalStorage(cart);
    }

    return cart;
  }


  removeItem(index: number) {
    const cart = this.getCart();
    cart.cartItems.splice(index, 1);
    this.updateLocalStorage(cart);
  }

  resetCart() {
    const initialCart: Cart = {
      _id: '',
      cartItems: [],
      user: '',
      totalPrice: 0
    };
    this.updateLocalStorage(initialCart);
  }

  incrementQuantity(cartItem: CartItem) {
    const cart = this.getCart();
    const itemIndex = cart.cartItems.findIndex(
      (item) => item.item._id === cartItem.item._id
    );

    if (itemIndex !== -1) {
      cart.cartItems[itemIndex].quantity += 1;
      this.updateLocalStorage(cart);
    }
  }

  decrementQuantity(cartItem: CartItem) {
    const cart = this.getCart();
    const itemIndex = cart.cartItems.findIndex(
      (item) => item.item._id === cartItem.item._id
    );

    if (itemIndex !== -1 && cart.cartItems[itemIndex].quantity > 1) {
      cart.cartItems[itemIndex].quantity -= 1;
      this.updateLocalStorage(cart);
    }
  }

  private updateLocalStorage(cart: Cart) {
    const cartJson = JSON.stringify(cart);
    localStorage.setItem('cart', cartJson);
    this.cart$.next(cart);
  }

  getCartFromServer(): Observable<Cart[]> {
    return this.http.get<Cart[]>(`${this.apiUrl}/admin/orders`);
  }

  saveCartToServer(cart: Cart) {
    return this.http.post<Cart>(`${this.apiUrl}`, cart);
  }

  getPreviousOrders(userId: string): Observable<Cart[]> {
    return this.http.get<Cart[]>(`${this.apiUrl}/previous-orders/${userId}`);
  }
}
