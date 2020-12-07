import { Component, OnInit, TemplateRef } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { Product } from 'src/app/classes/product.model';
import { ICategory } from 'src/app/interfaces/category.interface';
import { IProduct } from 'src/app/interfaces/product.interface';
import { CategoriesService } from 'src/app/services/categories.service';
import { ProductsService } from 'src/app/services/products.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.scss']
})
export class AdminProductsComponent implements OnInit {
  categories: Array<ICategory> = [];
  currentCategory: ICategory;
  categoryName: string;

  products: Array<IProduct> = [];
  productID: number | string;
  productName: string;
  productDescription: string;
  productPrice: number = null;
  productImage: string;
  productCount: number;
  searchName: string;
  modalRef: BsModalRef;
  checkColor: string;
  check: boolean = true;
  uploadPercent: Observable<number>;
  percent: boolean = true;

  constructor(private modalService: BsModalService, private prodService: ProductsService, private catService: CategoriesService,
    private storage: AngularFireStorage) { }

  ngOnInit(): void {
    this.getCategories();
    this.getProducts();
  }

  private getCategories(): void {
    this.catService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.categories = data;
    });
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
    });
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
    this.check = true;
    this.percent = true;
  }

  setCategory(): void {
    this.currentCategory = this.categories.filter(cat => cat.name === this.categoryName)[0];
    console.log(this.currentCategory);
  }

  addProduct(): void {
    if (this.productName.length > 0 && this.productDescription.length > 0 && this.productPrice != null && this.productImage.length > 0) {
      this.currentCategory = this.categories.filter(cat => cat.name === this.categoryName)[0];
      const newProd = new Product(1, this.currentCategory, this.productName,
        this.productDescription, this.productPrice, this.productCount, this.productImage)
      delete newProd.id;
      this.prodService.create(newProd).then(() => {
        console.log('Created new product successfully!');
      });
      this.reset();
      this.percent = false;
    }
  }

  editProduct(product: IProduct): void {
    this.productID = product.id;
    this.categoryName = product.category.name;
    this.productName = product.name;
    this.productDescription = product.description;
    this.productPrice = product.price;
    this.productCount = product.count;
    this.productImage = product.image;
    this.check = false;
  }

  saveEditProduct(): void {
    this.currentCategory = this.categories.filter(cat => cat.name === this.categoryName)[0];
    const updD = new Product(this.productID, this.currentCategory, this.productName,
      this.productDescription, this.productPrice, this.productCount, this.productImage);
    this.prodService.update(updD.id.toString(), updD)
      .then(() => console.log('The product was updated successfully!'))
      .catch(err => console.log(err));
    this.getProducts();
    this.reset();
  }

  deleteProduct(product: IProduct): void {
    this.prodService.delete(product.id.toString())
      .then(() => {
        console.log('The product was updated successfully!');
      })
      .catch(err => console.log(err));
  }

  reset(): void {
    this.productID = '';
    this.productName = '';
    this.productDescription = '';
    this.productPrice = null;
    this.productImage = '';
  }

  uploadFile(event) {
    const file = event.target.files[0];
    const filePath = `images/${file.name}`;
    console.log(file, filePath);
    const ref = this.storage.ref(filePath);
    const task = ref.put(file);
    this.uploadPercent = task.percentageChanges();
    this.uploadPercent.subscribe(
      data => {
        if (data < 90) {
          this.percent = true;
        }
      }
    )
    task.then(image => {
      this.storage.ref(`images/${image.metadata.name}`).getDownloadURL().subscribe(url => {
        this.productImage = url;
        console.log(this.productImage);
        this.percent = false;
      });
    });
  }

}
