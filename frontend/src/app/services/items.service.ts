import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Item } from '../models/item';

@Injectable({
  providedIn: 'root',
})
export class ItemsService {
  apiURLItems = environment.apiURL + 'items';

  constructor(private http: HttpClient) {}

  getAllItems(): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.apiURLItems}`);
  }

  getOneItem(itemId: string): Observable<Item> {
    return this.http.get<Item>(`${this.apiURLItems}/${itemId}`);
  }

  getMultipleItems(itemIds: string[]): Observable<Item[]> {
    const queryParams = itemIds.map((itemId) => `id=${itemId}`).join('&');
    return this.http.get<Item[]>(`${this.apiURLItems}?${queryParams}`);
  }

  createItem(itemData: FormData): Observable<Item[]> {
    return this.http.post<Item[]>(`${this.apiURLItems}`, itemData);
  }

  updateItem(itemData: FormData, itemId: string): Observable<Item[]> {
    return this.http.put<Item[]>(`${this.apiURLItems}/${itemId}`, itemData);
  }

  deleteItem(itemId: string): Observable<Item> {
    return this.http.delete<Item>(`${this.apiURLItems}/${itemId}`);
  }
  getNewArrivalItems(): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.apiURLItems}?newArrival=true`);
  }
}
