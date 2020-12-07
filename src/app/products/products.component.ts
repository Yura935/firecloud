import { Component, OnInit } from '@angular/core';
import { IProduct } from '../interfaces/product.interface';
import { OrderService } from '../services/order.service';
import { ProductsService } from '../services/products.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  products: Array<IProduct> = [];
  constructor(private prodService: ProductsService,
    private orderService: OrderService) { }

  ngOnInit(): void {
    this.getProducts();
  }

  private getProducts(): void {
    this.prodService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.products = data;
      console.log(data);
      
    });
    // this.prodService.getProducts().subscribe(
    //   data => {
    //     if (data.some(data => data.category.name === 'pizza')) {
    //       data = data.filter(data => data.category.name === 'pizza')
    //       this.products = data;
    //       console.log(this.products);
    //     }
    //   }
    // );
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
