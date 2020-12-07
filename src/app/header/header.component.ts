import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { IProduct } from '../interfaces/product.interface';
import { AuthService } from '../services/auth.service';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  totalPrice: number = 0;
  basket: Array<IProduct> = [];
  modalRef: BsModalRef;
  userName: string;
  userEmail: string;
  userPass: string;
  userCity: string;
  userImage: string = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/User_font_awesome.svg/1200px-User_font_awesome.svg.png"
  check: boolean = false;
  change: boolean = false;
  admin: boolean = false;
  acc: boolean = false;

  constructor(private orderService: OrderService, private modalService: BsModalService, private authService: AuthService) { }

  ngOnInit(): void {
    this.getLocalProducts();
    this.checkMyBasket();
    this.checkLocalUser();
    this.checkUserLogin();
  }

  private checkLocalUser(): void {
    if (localStorage.getItem('user')) {
      if (JSON.parse(localStorage.getItem('user')).role == 'user') {
        this.change = true;
        this.acc = true;
      }
      else {
        this.admin = true;
        this.change = true;
      }

    }
    else {
      this.change = false;
      this.admin = false;
      this.acc = false;
    }
  }

  private checkUserLogin(): void {
    this.authService.checkSignIn.subscribe(() => {
      this.checkLocalUser();
    });
  }

  private checkMyBasket(): void {
    this.orderService.basket.subscribe(
      data => {
        this.basket = data;
        this.totalPrice = this.getTotal(this.basket);
      }
    )
  }

  private getLocalProducts(): void {
    if (localStorage.getItem('basket')) {
      this.basket = JSON.parse(localStorage.getItem('basket'));
      this.totalPrice = this.getTotal(this.basket);
    }
  }

  private getTotal(products: Array<IProduct>): number {
    return products.reduce((total, prod) => total + (prod.price * prod.count), 0);
  }

  signModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template);
  }

  signUP(): void {
    if (this.userEmail && this.userPass && this.userName && this.userCity) {
      this.authService.signUp(this.userEmail, this.userPass, this.userName, this.userCity, this.userImage);
      this.acc = false;
      this.change = false;
      this.reset();
    }
  }

  signIN(): void {
    if (this.userEmail && this.userPass) {
      this.authService.signIn(this.userEmail, this.userPass)
      if (this.userEmail == 'admin@gmail.com') {
        this.admin = true;
        this.change = true;
        this.reset();
      }
      else {
        this.change = true;
        this.acc = true;
        this.reset();
      }
    }
  }

  signOUT(): void {
    this.authService.signOut();
    this.admin = false;
    this.change = false;
    this.acc = false;
    this.reset();
  }

  goSignUp(): void {
    if (!this.check) {
      this.check = true;
    }
    else {
      this.check = false;
    }
  }

  reset(): void {
    this.check = false;
    this.userName = '';
    this.userEmail = '';
    this.userPass = '';
    this.userCity = '';
  }

  openDel(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template,
      Object.assign({}, { class: 'gray modal-sm modal-dialog-centered ' }));
  }

}
