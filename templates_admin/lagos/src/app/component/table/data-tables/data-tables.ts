import { DecimalPipe, AsyncPipe } from '@angular/common';
import { Component, inject, viewChildren } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';

import { Table } from '../../../shared/data/data/table/data-table';
import {
  BasicDataTableDirective,
  SortEvent,
} from '../../../shared/directive/basic-data-table.directive';
import { BasicdatatableService } from '../../../shared/services/basicdatatable.service';

@Component({
  selector: 'app-data-tables',
  templateUrl: './data-tables.html',
  styleUrls: ['./data-tables.scss'],
  imports: [FormsModule, ReactiveFormsModule, NgbModule, BasicDataTableDirective, AsyncPipe],
  providers: [BasicdatatableService, DecimalPipe],
})
export class DataTables {
  public isShow: boolean = false;
  public basicDataTable$: Observable<Table[]>;
  public total$: Observable<number>;
  public basicData: Table[];
  public readonly headers = viewChildren(BasicDataTableDirective);
  public service = inject(BasicdatatableService);

  constructor() {
    this.basicDataTable$ = this.service.basicDataTable$;
    this.total$ = this.service.total$;
  }

  ngOnInit() {
    this.service.basicDataTable$.subscribe(data => {
      if (data) {
        this.basicData = data;
      }
    });
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
