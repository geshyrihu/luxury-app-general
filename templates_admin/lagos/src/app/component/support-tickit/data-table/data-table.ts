import { DecimalPipe, AsyncPipe } from '@angular/common';
import { Component, inject, viewChildren } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';

import { supportDB } from '../../../shared/data/data/support-tickit/support-tickit';
import {
  SortEvent,
  SupportTicketDirective,
} from '../../../shared/directive/support-ticket.directive';
import { SupportTicketService } from '../../../shared/services/support-ticket.service';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.html',
  styleUrls: ['./data-table.scss'],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    SupportTicketDirective,
    AsyncPipe,
    DecimalPipe,
  ],
  providers: [SupportTicketService, DecimalPipe],
})
export class DataTable {
  public countries$: Observable<supportDB[]>;
  public total$: Observable<number>;
  public supportData: supportDB[];
  public service = inject(SupportTicketService);
  readonly headers = viewChildren(SupportTicketDirective);

  constructor() {
    this.countries$ = this.service.support$;
    this.total$ = this.service.total$;
  }

  ngOnInit() {
    this.service.support$.subscribe(data => {
      if (data) {
        this.supportData = data;
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
