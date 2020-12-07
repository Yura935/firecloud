import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { IBlog } from '../interfaces/blog.interface';

@Injectable({
  providedIn: 'root'
})

export class BlogService {
  private url: string;
  private dbPath = '/blogs';
  blogsRef: AngularFirestoreCollection<IBlog> = null;

  constructor(private http: HttpClient, private db: AngularFirestore) {
    this.url = 'http://localhost:3001/blogs';
    this.blogsRef = this.db.collection(this.dbPath);
  }

  getJSONBlogs(): Observable<Array<IBlog>> {
    return this.http.get<Array<IBlog>>(this.url)
  }

  postJSONBlog(blog: IBlog): Observable<IBlog> {
    return this.http.post<IBlog>(this.url, blog);
  }

  updateJSONBlog(blog: IBlog): Observable<IBlog> {
    return this.http.put<IBlog>(`${this.url}/${blog.id}`, blog)
  }

  deleteJSONBlog(blog: IBlog): Observable<IBlog> {
    return this.http.delete<IBlog>(`${this.url}/${blog.id}`);
  }

  getJSONOneBlog(id: number | string): Observable<IBlog> {
    return this.http.get<IBlog>(`${this.url}/${id}`);
  }

  getAll(): AngularFirestoreCollection<IBlog> {
    return this.blogsRef;
  }

  create(blog: IBlog): any {
    return this.blogsRef.add({ ...blog });
  }

  update(id: string, data: any): Promise<void> {
    return this.blogsRef.doc(id).update({...data});
  }

  delete(id: string): Promise<void> {
    return this.blogsRef.doc(id).delete();
  }
}
