import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Order } from 'src/app/classes/order.model';
import { IOrder } from 'src/app/interfaces/order.interface';
import { IProduct } from 'src/app/interfaces/product.interface';
import { OrderService } from 'src/app/services/order.service';


@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss']
})
export class BasketComponent implements OnInit {

  basket: Array<IProduct> = [];
  totalPrice: number = 0;
  modalRef: BsModalRef;

  orders: Array<IOrder>;
  userName: string;
  userEmail: string;
  date: Date = new Date();
  userNumber: number;
  userLocation: string;
  payment: string;

  constructor(private orderService: OrderService, private modalService: BsModalService) { }

  ngOnInit(): void {
    this.getLocalProducts();
    this.getOrders();
  }

  private getLocalProducts(): void {
    if (localStorage.getItem('basket')) {
      this.basket = JSON.parse(localStorage.getItem('basket'));
      this.totalPrice = this.getTotal(this.basket);
    }
    console.log(this.basket);
  }

  private getTotal(products: Array<IProduct>): number {
    return products.reduce((total, prod) => total + (prod.price * prod.count), 0);
  }

  productCount(product: IProduct, status: boolean): void {
    if (status) {
      product.count++;
    }
    else {
      if (product.count > 1) {
        product.count--;
      }
    }
    this.totalPrice = this.getTotal(this.basket);
    this.orderService.basket.next(this.basket);
    localStorage.setItem('basket', JSON.stringify(this.basket));
  }

  removeProduct(product: IProduct): void {
    if (confirm('Are you sure?')) {
      const index = this.basket.findIndex(prod => prod.id === product.id)
      this.basket.splice(index, 1);
      this.totalPrice = this.getTotal(this.basket);
      this.orderService.basket.next(this.basket);
      localStorage.setItem('basket', JSON.stringify(this.basket));
    }
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  private getOrders(): void {
    this.orderService.getOrders().subscribe(
      data => {
        this.orders = data;
      }
    );
  }

  addOrder(): void {
    if(this.userName.length>0 && this.userEmail.length>0 && this.userNumber != null && this.userLocation.length>0 && this.payment.length>0){
      const newOrder = new Order(1, this.userName, this.userEmail, this.date, this.userNumber, this.userLocation, this.payment);
      delete newOrder.id;
      this.orderService.postOrder(newOrder).subscribe(() => {
        this.getOrders();
      });
      this.reset();
    }
  }

  reset(): void{
    this.userName = '';
    this.userEmail = '';
    this.userNumber = null;
    this.userLocation = '';
    this.payment = '';
    this.totalPrice = 0;
    this.basket = [];
    localStorage.setItem('basket', JSON.stringify(this.basket));
    this.orderService.basket.next(this.basket);
    this.getTotal(this.basket);
  }

}
