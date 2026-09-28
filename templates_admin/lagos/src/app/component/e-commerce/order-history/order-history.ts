import { DecimalPipe, AsyncPipe } from '@angular/common';
import { Component, inject, viewChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BarRatingModule } from 'ngx-bar-rating';
import { Observable } from 'rxjs';

import { FeatherIcons } from '../../../shared/components/feather-icons/feather-icons';
import * as data from '../../../shared/data/data/ecommerce/order-history';
import {
  orderHistoraySortableDirective,
  SortEvent,
} from '../../../shared/directive/order-historay-sortable.directive';
import { OrderHistoryService } from '../../../shared/services/order-history.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.html',
  styleUrls: ['./order-history.scss'],
  imports: [
    BarRatingModule,
    NgbModule,
    FeatherIcons,
    FormsModule,
    orderHistoraySortableDirective,
    AsyncPipe,
  ],
  providers: [OrderHistoryService, DecimalPipe],
})
export class OrderHistory {
  public isShow: boolean = false;
  public orderHistoryData$: Observable<data.orderTable[]>;
  public total$: Observable<number>;
  public orderHistory = data.orderHistory;
  public orderTableData = data.orderTableData;
  public orderList: data.orderTable[];
  public orderHistoryService = inject(OrderHistoryService);
  public readonly headers = viewChildren(orderHistoraySortableDirective);

  constructor() {
    this.orderHistoryData$ = this.orderHistoryService.orderList$;
    this.total$ = this.orderHistoryService.total$;
  }

  ngOnInit() {
    this.orderHistoryService.orderList$.subscribe(data => {
      if (data) {
        this.orderList = data;
      }
    });
  }

  cancelOrder(index: number, id: number) {
    this.orderHistory.forEach(data => {
      data.data.forEach(element => {
        if (element.id == id) {
          data.data.splice(index, 1);
        }
      });
    });
  }

  onSort({ column, direction }: SortEvent) {
    this.headers().forEach(header => {
      if (header.sortableOrder() !== column) {
        header.currentDirection.set('');
      }
    });
    this.orderHistoryService.sortColumn = column;
    this.orderHistoryService.sortDirection = direction;
  }
}
