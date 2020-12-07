import { Component, OnInit } from '@angular/core';
import { IProduct } from 'src/app/interfaces/product.interface';
import { OrderService } from 'src/app/services/order.service';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-drinks',
  templateUrl: './drinks.component.html',
  styleUrls: ['./drinks.component.scss']
})
export class DrinksComponent implements OnInit {
  currentCategory: string = 'drinks';
  products: Array<IProduct> = [];
  constructor(private prodService: ProductsService,
    private orderService: OrderService) { }

  ngOnInit(): void {
    this.getProducts(this.currentCategory);
  }

  private getProducts(cat: string): void {
    this.products = [];
    this.prodService.getAllCategories(cat).onSnapshot(
      snap => {
        this.products = [];
        snap.forEach(prod => {
          const product = {
            id: prod.id,
            ...prod.data() as IProduct
          };
          this.products.push(product);
        })
      }
    )
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
  }

  addToBasket(product: IProduct): void {
    console.log(product);
    this.orderService.addBasket(product);
    product.count = 1;
  }

}
