import { Component, inject } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ContactsData } from './contacts-data/contacts-data';
import { NewContacts } from './modal/new-contacts/new-contacts';
import { ViewCategory } from './modal/view-category/view-category';
import { FeatherIcons } from '../../shared/components/feather-icons/feather-icons';
import * as data from '../../shared/data/data/contacts/contacts';
import { ClickOutsideDirective } from '../../shared/directive/click-outside.directive';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.html',
  styleUrls: ['./contacts.scss'],
  imports: [FeatherIcons, ContactsData, ClickOutsideDirective],
})
export class Contacts {
  public contact = data.contact;
  public selectedId: number;
  public activeStatus: boolean;
  public isOpen: boolean = false;
  public viewList = data.viewList;

  private modalService = inject(NgbModal);

  newContact() {
    this.modalService.open(NewContacts, {
      size: 'lg',
    });
  }

  viewCategory() {
    this.modalService.open(ViewCategory, {
      size: 'lg',
    });
  }

  changeData(id: number) {
    const getId = this.contact.filter(element => element.title_id == id);
    this.selectedId = getId[0].title_id;
  }

  outSide() {
    this.isOpen = false;
  }
}
