import { DecimalPipe } from '@angular/common';
import { inject, Injectable, PipeTransform } from '@angular/core';

import {
  BehaviorSubject,
  Observable,
  Subject,
  debounceTime,
  delay,
  of,
  switchMap,
  tap,
} from 'rxjs';

import { productListData, productListInterface } from '../data/data/ecommerce/product-list';
import { SortColumn, SortDirection } from '../directive/product-list-sortable.directive';

interface SearchResult {
  products: productListInterface[];
  total: number;
}

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
}

const compare = (v1: string | number, v2: string | number) => (v1 < v2 ? -1 : v1 > v2 ? 1 : 0);

function sort(
  products: productListInterface[],
  column: SortColumn,
  direction: string,
): productListInterface[] {
  if (direction === '' || column === '') {
    return products;
  } else {
    return [...products].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(product: productListInterface, term: string, pipe: PipeTransform) {
  return (
    product.name.toLowerCase().includes(term.toLowerCase()) ||
    product.category.toLowerCase().includes(term.toLowerCase()) ||
    product.category.toLowerCase().includes(term.toLowerCase()) ||
    product.sku.toLowerCase().includes(term.toLowerCase()) ||
    product.status.toLowerCase().includes(term.toLowerCase()) ||
    pipe.transform(product.price).includes(term) ||
    pipe.transform(product.qty).includes(term)
  );
}

@Injectable({
  providedIn: 'root',
})
export class ProductListService {
  private pipe = inject(DecimalPipe);
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _productList$ = new BehaviorSubject<productListInterface[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  private _product: State = {
    page: 1,
    pageSize: 10,
    searchTerm: '',
    sortColumn: '',
    sortDirection: '',
  };

  constructor() {
    this._search$
      .pipe(
        tap(() => this._loading$.next(true)),
        debounceTime(200),
        switchMap(() => this._search()),
        delay(200),
        tap(() => this._loading$.next(false)),
      )
      .subscribe(result => {
        this._productList$.next(result.products);
        this._total$.next(result.total);
      });
    this._search$.next();
  }

  get productList$() {
    return this._productList$.asObservable();
  }
  get total$() {
    return this._total$.asObservable();
  }
  get loading$() {
    return this._loading$.asObservable();
  }
  get page() {
    return this._product.page;
  }
  get pageSize() {
    return this._product.pageSize;
  }
  get searchTerm() {
    return this._product.searchTerm;
  }

  set page(page: number) {
    this._set({ page });
  }
  set pageSize(pageSize: number) {
    this._set({ pageSize });
  }
  set searchTerm(searchTerm: string) {
    this._set({ searchTerm });
  }
  set sortColumn(sortColumn: SortColumn) {
    this._set({ sortColumn });
  }
  set sortDirection(sortDirection: SortDirection) {
    this._set({ sortDirection });
  }

  private _set(patch: Partial<State>) {
    Object.assign(this._product, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {
    const { sortColumn, sortDirection, pageSize, page, searchTerm } = this._product;

    // 1. sort
    let products = sort(productListData, sortColumn, sortDirection);

    // 2. filter
    products = products.filter(list => matches(list, searchTerm, this.pipe));
    const total = products.length;

    // 3. paginate
    products = products.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    return of({ products, total });
  }
}
