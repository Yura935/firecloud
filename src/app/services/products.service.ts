import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { IProduct } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private url: string;
  private dbPath = '/products';
  productsRef: AngularFirestoreCollection<IProduct> = null;

  constructor(private http: HttpClient, private db: AngularFirestore) {
    this.url = 'http://localhost:3001/products';
    this.productsRef = this.db.collection(this.dbPath);
  }

  getProducts(): Observable<Array<IProduct>> {
    return this.http.get<Array<IProduct>>(this.url)
  }

  postProduct(product: IProduct): Observable<IProduct> {
    return this.http.post<IProduct>(this.url, product);
  }

  updateProduct(product: IProduct): Observable<IProduct> {
    return this.http.put<IProduct>(`${this.url}/${product.id}`, product)
  }

  deleteProduct(product: IProduct): Observable<IProduct> {
    return this.http.delete<IProduct>(`${this.url}/${product.id}`);
  }

  getCategoryProducts(category: string): Observable<Array<IProduct>> {
    return this.http.get<Array<IProduct>>(`${this.url}?category.urlName=${category}`)
  }

  getOneProduct(id: number | string): Observable<IProduct> {
    return this.http.get<IProduct>(`${this.url}/${id}`)
  }

  getAll(): AngularFirestoreCollection<IProduct> {
    return this.productsRef;
  }

  getAllCategories(categoryName: string): any {
    return this.productsRef.ref.where('category.name', '==', categoryName);
  }

  create(product: IProduct): any {
    return this.productsRef.add({ ...product });
  }

  update(id: string, data: any): Promise<void> {
    return this.productsRef.doc(id).update({...data});
  }

  delete(id: string): Promise<void> {
    return this.productsRef.doc(id).delete();
  }
}
