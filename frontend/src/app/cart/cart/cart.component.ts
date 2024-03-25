import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Cart, CartItem } from 'src/app/models/cart';
import { CartService } from 'src/app/services/cart.service';
import { ItemsService } from 'src/app/services/items.service';
import { UserServiceService } from '../../services/user-service.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cartItemDetailed: CartItem[] = [];
  respCart: Cart;
  totalPrice: number;
  userName: string;
  // previousOrders: Cart[] = [];

  constructor(
    private cartService: CartService,
    private itemService: ItemsService,
    private snackBar: MatSnackBar,
    private userService: UserServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getItemDetails();
    this.getUserName();
  }

  getItemDetails() {
    this.cartService.cart$.subscribe((respCart) => {
      this.cartItemDetailed = [];
      this.respCart = respCart;
      let totalPrice = 0;

      respCart.cartItems.forEach((cartItem) => {
        this.itemService.getOneItem(cartItem.item._id).subscribe((item) => {
          const itemTotalPrice = item.price * cartItem.quantity;
          totalPrice += itemTotalPrice;

          this.cartItemDetailed.push({
            item: item,
            quantity: cartItem.quantity,
          });

          this.totalPrice = totalPrice;

          this.cartItemDetailed.sort((a, b) =>
            a.item._id.localeCompare(b.item._id)
          );
        });
      });
    });
  }

  trackCartItemBy(index: number, item: CartItem): string {
    return item.item._id;
  }

  removeItem(index: number, cartItem: CartItem) {
    this.cartService.removeItem(index);

    this.snackBar.open(
      'You deleted ' + cartItem.item.name + ' from the cart',
      'OK',
      {
        duration: 2000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      }
    );
  }

  incrementQuantity(cartItem: CartItem) {
    this.cartService.incrementQuantity(cartItem);
  }

  decrementQuantity(cartItem: CartItem) {
    this.cartService.decrementQuantity(cartItem);
  }

  proceedToCheckOut() {
    const cart: Cart = this.cartService.getCart();
    const userId = this.getUserId();

    if (!userId || userId === 'guest') {
      this.snackBar.open('You need to log in to buy products!.', 'OK', {
        duration: 2000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
      return;
    }

    if (cart.cartItems.length === 0) {
      this.snackBar.open(
        'Your cart is empty. Please add items to proceed with the checkout.',
        'OK',
        {
          duration: 2000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        }
      );
      return;
    }

    cart.user = userId;
    cart.timestamp = new Date();
    this.cartService.saveCartToServer(cart).subscribe(
      (response) => {
        console.log('Cart saved to the server:', response);

        this.cartService.resetCart();

        this.snackBar.open(
          'Order Successfull, Thanks for Shopping with us!',
          'OK',
          {
            duration: 2000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          }
        );
      },
      (error) => {
        console.error('Error saving cart data:', error);

        this.snackBar.open('Error occurred while saving cart data!', 'OK', {
          duration: 2000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      }
    );
  }

  backToShop() {
    this.router.navigateByUrl('/');
  }

  getUserName(): void {
    const userId = localStorage.getItem('user');
    if (userId) {
      this.userService.getOneUser(userId).subscribe(
        (user) => {
          this.userName = user.name;
        },
        (error) => {
          console.log('Error retrieving user name:', error);
        }
      );
    } else {
      this.userName = 'guest';
    }
  }

  getUserId(): string {
    return localStorage.getItem('user');
  }

  updateCartItem(cartItem: CartItem) {
    const cart = this.cartService.getCart();
    const existingItem = cart.cartItems.find(
      (item) => item.item._id === cartItem.item._id
    );

    if (existingItem) {
      existingItem.quantity = cartItem.quantity;
    }

    this.cartService.setCartItem(cartItem);
  }
}
