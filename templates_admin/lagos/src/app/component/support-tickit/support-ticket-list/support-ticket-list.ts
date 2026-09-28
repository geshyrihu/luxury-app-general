import { Component, input } from '@angular/core';

import { ticketListData } from '../../../shared/data/data/support-tickit/support-tickit';

@Component({
  selector: 'app-support-ticket-list',
  templateUrl: './support-ticket-list.html',
  styleUrls: ['./support-ticket-list.scss'],
  imports: [],
})
export class SupportTicketList {
  readonly data = input<ticketListData>();
}
