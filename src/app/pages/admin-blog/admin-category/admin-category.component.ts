import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Category } from 'src/app/classes/category.model';
import { ICategory } from 'src/app/interfaces/category.interface';
import { CategoriesService } from 'src/app/services/categories.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-admin-category',
  templateUrl: './admin-category.component.html',
  styleUrls: ['./admin-category.component.scss']
})
export class AdminCategoryComponent implements OnInit {

  categories: Array<ICategory> = [];
  categoryID: string;
  categoryName: string;
  searchName: string;
  modalRef: BsModalRef;
  checkColor: string;
  check: boolean = true;
  constructor(private catService: CategoriesService, private modalService: BsModalService) { }

  ngOnInit(): void {
    this.getCategories();
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

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
    this.check = true;
    this.categoryName = '';
  }

  addCategory(): void {
    if (this.categoryName.length > 0) {
      const newCat = new Category('1', this.categoryName);
      delete newCat.id;
      this.catService.create(newCat).then(() => {
        console.log('Created new category successfully!');
      })
      this.categoryName = '';
    }
    else if (this.categoryName.length == 0) {
      this.checkColor = 'gray';
    }
  }

  editCategory(category: ICategory): void {
    this.categoryID = category.id;
    this.categoryName = category.name;
    this.check = false;
  }

  saveEditCategory(): void {
    const updD = new Category(this.categoryID, this.categoryName);
    this.catService.update(updD.id.toString(), updD)
      .then(() => console.log('The product was updated successfully!'))
      .catch(err => console.log(err));
    this.categoryName = '';
    this.getCategories();
  }

  deleteCategory(category: ICategory): void {
    this.catService.delete(category.id.toString())
      .then(() => {
        console.log('The category was updated successfully!');
      })
      .catch(err => console.log(err));
    this.getCategories();
  }
}
