import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  checkSignIn: Subject<any> = new Subject<any>();

  constructor(private http: HttpClient, private db: AngularFirestore, private auth: AngularFireAuth, private router: Router) { }

  signUp(email: string, password: string, userName: string, userCity: string, userImage: string): void {
    this.auth.createUserWithEmailAndPassword(email, password)
      .then(userResponse => {
        console.log(userResponse);
        const user = {
          id: userResponse.user.uid,
          email: userResponse.user.email,
          password: password,
          role: 'user',
          name: userName,
          city: userCity,
          image: userImage
        }
        this.db.collection('users').add(user)
          .then(collection => {
            collection.get()
              .then(user => {
                localStorage.setItem('user', JSON.stringify(user.data()));
                const ROLE = JSON.parse(localStorage.getItem('user'))
                if (ROLE.role === 'user') {
                  this.router.navigateByUrl('profile');
                }
                else {
                  this.router.navigateByUrl('blog');
                }
              });
          });
      })
      .catch(err => {
        alert(err);
        console.log(err);
      });
  }

  signIn(email: string, password: string): void {
    this.auth.signInWithEmailAndPassword(email, password)
      .then(userResponse => {
        this.db.collection('users').ref.where('id', '==', userResponse.user.uid).onSnapshot(
          snap => {
            snap.forEach(user => {
              localStorage.setItem('user', JSON.stringify(user.data()));
              this.checkSignIn.next(true);
              const ROLE = JSON.parse(localStorage.getItem('user'))
              if (ROLE.role === 'admin') {
                this.router.navigateByUrl('admin-blog');
              }
              else {
                this.router.navigateByUrl('profile');

              }
            })
          }
        )
      })
      .catch(err => {
        alert(err);
        console.log(err);
      })
  }

  signOut(): void {
    this.auth.signOut()
      .then(() => {
        localStorage.removeItem('user');
        this.checkSignIn.next(false);
        this.router.navigateByUrl('blog');
      })
      .catch(err => {
        alert(err);
        console.log(err);
      })
  }

}
