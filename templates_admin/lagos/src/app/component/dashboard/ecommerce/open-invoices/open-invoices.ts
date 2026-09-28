import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { openInvoices } from '../../../../shared/data/data/dashboard/ecommerce';
import { ClickOutsideDirective } from '../../../../shared/directive/click-outside.directive';

@Component({
  selector: 'app-open-invoices',
  templateUrl: './open-invoices.html',
  styleUrl: './open-invoices.scss',
  imports: [ClickOutsideDirective, RouterModule],
})
export class OpenInvoices {
  public openInvoices = openInvoices;
  public isShow: boolean = false;
  outSide() {
    this.isShow = false;
  }
}
