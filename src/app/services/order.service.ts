import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { IOrder } from '../interfaces/order.interface';
import { IProduct } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  basket: Subject<Array<IProduct>> = new Subject<Array<IProduct>>();
  private url: string;
  constructor(private http: HttpClient) {
    this.url = 'http://localhost:3001/orders';
  }

  addBasket(product: IProduct): void {
    let localProducts: Array<IProduct> = [];
    if (localStorage.getItem('basket')) {
      localProducts = JSON.parse(localStorage.getItem('basket'));
      if (localProducts.some(prod => prod.id === product.id)) {
        const index = localProducts.findIndex(prod => prod.id === product.id);
        localProducts[index].count += product.count;
      }
      else {
        localProducts.push(product);
      }
    }
    else {
      localProducts.push(product);
    }
    localStorage.setItem('basket', JSON.stringify(localProducts));
    this.basket.next(localProducts);
  }

  getOrders(): Observable<Array<IOrder>> {
    return this.http.get<Array<IOrder>>(this.url)
  }

  postOrder(order: IOrder): Observable<IOrder> {
    return this.http.post<IOrder>(this.url, order);
  }


}
