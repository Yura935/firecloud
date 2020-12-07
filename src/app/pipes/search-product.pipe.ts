import { Pipe, PipeTransform } from '@angular/core';
import { IProduct } from '../interfaces/product.interface';

@Pipe({
  name: 'searchProduct'
})
export class SearchProductPipe implements PipeTransform {

  transform(value: Array<IProduct>, field: string): Array<IProduct> {
    if (!value) {
      return value
    }
    if (!field) {
      return value
    }
    return value.filter(phone => phone.category.name.toLocaleLowerCase().includes(field));
  }
}
