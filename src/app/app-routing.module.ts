import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BlogComponent } from './pages/blog/blog.component';
import { AdminBlogComponent } from './pages/admin-blog/admin-blog.component';
import { AdminCategoryComponent } from './pages/admin-blog/admin-category/admin-category.component';
import { AdminProductsComponent } from './pages/admin-blog/admin-products/admin-products.component';
import { AdminBlogsComponent } from './pages/admin-blog/admin-blogs/admin-blogs.component';
import { BlogDetailsComponent } from './pages/blog-details/blog-details.component';
import { ProductsComponent } from './products/products.component';
import { BasketComponent } from './pages/basket/basket.component';
import { PizzaComponent } from './products/pizza/pizza.component';
import { SaladComponent } from './products/salad/salad.component';
import { DrinksComponent } from './products/drinks/drinks.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ProfileGuard } from './guards/profile.guard';
import { AdminGuard } from './guards/admin.guard';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'products' },
  { path: 'blog', component: BlogComponent },
  {
    path: 'products', component: ProductsComponent, children: [
      { path: '', pathMatch: 'full', redirectTo: 'pizza' },
      { path: 'pizza', component: PizzaComponent },
      { path: 'salad', component: SaladComponent },
      { path: 'drinks', component: DrinksComponent }
    ]
  },
  {
    path: 'admin-blog', component: AdminBlogComponent, canActivate: [AdminGuard], children: [
      { path: '', pathMatch: 'full', redirectTo: 'category' },
      { path: 'category', component: AdminCategoryComponent },
      { path: 'products', component: AdminProductsComponent },
      { path: 'blogs', component: AdminBlogsComponent }
    ]
  },
  { path: 'blog/:id', component: BlogDetailsComponent },
  { path: 'basket', component: BasketComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [ProfileGuard] },
  { path: '**', component: BlogComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
