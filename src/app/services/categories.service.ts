import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ICategory } from '../interfaces/category.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  private url: string;
  private dbPath = '/categories';
  categoriesRef: AngularFirestoreCollection<ICategory> = null;

  constructor(private http: HttpClient,private db: AngularFirestore) {
    this.url = 'http://localhost:3001/categories';
    this.categoriesRef = this.db.collection(this.dbPath);
  }

  getCategories(): Observable<Array<ICategory>> {
    return this.http.get<Array<ICategory>>(this.url)
  }

  postCategory(category: ICategory): Observable<ICategory> {
    return this.http.post<ICategory>(this.url, category);
  }

  updateCategory(category: ICategory): Observable<ICategory> {
    return this.http.put<ICategory>(`${this.url}/${category.id}`, category)
  }

  deleteCategory(category: ICategory): Observable<ICategory> {
    return this.http.delete<ICategory>(`${this.url}/${category.id}`);
  }

  getAll(): AngularFirestoreCollection<ICategory> {
    return this.categoriesRef;
  }

  create(category: ICategory): any {
    return this.categoriesRef.add({ ...category });
  }

  update(id: string, data: any): Promise<void> {
    return this.categoriesRef.doc(id).update({...data});
  }

  delete(id: string): Promise<void> {
    return this.categoriesRef.doc(id).delete();
  }
}
