import { Component } from '@angular/core';

import { DataTable } from './data-table/data-table';
import { SupportTicketList } from './support-ticket-list/support-ticket-list';
import { ticketListStatus } from '../../shared/data/data/support-tickit/support-tickit';

@Component({
  selector: 'app-support-tickit',
  templateUrl: './support-tickit.html',
  styleUrls: ['./support-tickit.scss'],
  imports: [DataTable, SupportTicketList],
})
export class SupportTickit {
  public ticketListStatus = ticketListStatus;
}
