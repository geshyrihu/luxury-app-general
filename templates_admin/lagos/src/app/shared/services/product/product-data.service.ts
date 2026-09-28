import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable, map } from 'rxjs';

import { Products } from '../../model/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductDataService {
  private http = inject(HttpClient);

  products(): Observable<Products[]> {
    return this.http.get<Products[]>('assets/data/product.json');
  }

  public getProduct(id: number): Observable<Products | undefined> {
    return this.products().pipe(map((items: Products[]) => items.find(item => item.id === id)));
  }
}
