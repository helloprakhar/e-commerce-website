import { Item } from "./item";

export class Cart {
    _id:string;
    cartItems:CartItem[];
    user?:string;
    totalPrice:number;
    timestamp?: Date;
}

export class CartItem {
    _id?:string;
    item:Item;
    quantity:number;
    user?:string;
}