import { Component, inject } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { CommonSvgIcon } from '../../../shared/components/common-svg-icon/common-svg-icon';
import * as data from '../../../shared/data/data/ecommerce/email';
import { email } from '../../../shared/data/data/ecommerce/email';
import { ClickOutsideDirective } from '../../../shared/directive/click-outside.directive';
import { EmailContent } from '../email-content/email-content';
import { AddLabel } from '../model/add-label/add-label';
import { ComposeEmail } from '../model/compose-email/compose-email';

@Component({
  selector: 'app-email-left-aside',
  templateUrl: './email-left-aside.html',
  styleUrls: ['./email-left-aside.scss'],
  imports: [ClickOutsideDirective, EmailContent, CommonSvgIcon],
})
export class EmailLeftAside {
  public emailFilter = data.emailFilter;
  public selectedId: number;
  public status: number;
  public isOpen: boolean = false;

  private modal = inject(NgbModal);

  changeData(item: email) {
    const getId = this.emailFilter.filter(x => x.id == item.id);
    this.selectedId = getId[0].id;
    this.emailFilter.filter(data => {
      if (data.id == item.id) {
        data.status = true;
      } else {
        data.status = false;
      }
    });
  }

  openEmail() {
    this.modal.open(ComposeEmail, { size: 'lg' });
  }

  addLabel() {
    this.modal.open(AddLabel);
  }

  outSide() {
    this.isOpen = false;
  }
}
