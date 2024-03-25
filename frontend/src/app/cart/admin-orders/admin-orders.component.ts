import { Component, OnInit } from '@angular/core';
import { Cart, CartItem } from 'src/app/models/cart';
import { CartService } from 'src/app/services/cart.service';
import { ItemsService } from 'src/app/services/items.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.css'],
})
export class AdminOrdersComponent implements OnInit {
  previousOrders: Cart[] = [];
  cartItemDetailed: CartItem[] = [];
  respCart: Cart;
  totalPrice: number;
  userName: string;

  constructor(
    private cartService: CartService,
    private itemService: ItemsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getItemDetails();
    this.getPreviousOrders();
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
        });
      });
    });
  }

  getPreviousOrders() {
    this.cartService.getCartFromServer().subscribe(
      (previousOrders) => {
        this.previousOrders = previousOrders;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  getOrderDate(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleString(); 
  }

  backToShop() {
    this.router.navigateByUrl('/');
  }
}
