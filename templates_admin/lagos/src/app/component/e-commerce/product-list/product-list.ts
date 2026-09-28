import { DecimalPipe, NgClass, AsyncPipe } from '@angular/common';
import { Component, inject, viewChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BarRatingModule } from 'ngx-bar-rating';
import { Observable } from 'rxjs';

import { CommonSvgIcon } from '../../../shared/components/common-svg-icon/common-svg-icon';
import { FeatherIcons } from '../../../shared/components/feather-icons/feather-icons';
import { productListInterface } from '../../../shared/data/data/ecommerce/product-list';
import {
  ProductListSortableDirective,
  SortEvent,
} from '../../../shared/directive/product-list-sortable.directive';
import { ProductListService } from '../../../shared/services/product-list.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.scss'],
  imports: [
    NgbModule,
    FormsModule,
    CommonSvgIcon,
    FeatherIcons,
    RouterModule,
    BarRatingModule,
    ProductListSortableDirective,
    AsyncPipe,
    NgClass,
  ],
  providers: [ProductListService, DecimalPipe],
})
export class ProductList {
  public isShow: boolean = false;
  public productList$: Observable<productListInterface[]>;
  public productList: productListInterface[] = [];
  public total$: Observable<number>;
  public service = inject(ProductListService);
  public readonly headers = viewChildren(ProductListSortableDirective);

  constructor() {
    this.productList$ = this.service.productList$;
    this.total$ = this.service.total$;
  }

  ngOnInit() {
    this.service.productList$.subscribe(data => {
      if (data) {
        this.productList = data;
      }
    });
  }

  tiggle() {
    this.isShow = !this.isShow;
  }

  onSort({ column, direction }: SortEvent) {
    this.headers().forEach(header => {
      if (header.sortable() !== column) {
        header.currentDirection.set('');
      }
    });
    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }
}
