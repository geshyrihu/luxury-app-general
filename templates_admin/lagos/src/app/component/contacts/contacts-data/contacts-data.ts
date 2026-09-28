import { NgClass } from '@angular/common';
import { Component, SimpleChanges, input } from '@angular/core';

import { ProfileData } from './profile-data/profile-data';
import * as data from '../../../shared/data/data/contacts/contacts';

@Component({
  selector: 'app-contacts-data',
  templateUrl: './contacts-data.html',
  styleUrls: ['./contacts-data.scss'],
  imports: [ProfileData, NgClass],
})
export class ContactsData {
  readonly activeStatus = input<boolean>();
  readonly selectedId = input<number>();
  readonly data = input<data.contactData[]>();
  public getTaskData: data.contactData;
  public open: boolean = false;
  public contactData: data.dataList;

  ngOnInit() {
    this.data()?.map((data: data.contactData) => {
      if (data.status) {
        this.getTaskData = data;
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    let id = changes['selectedId']?.currentValue;
    this.data()?.map((data: data.contactData) => {
      if (data.title_id === id) {
        this.getTaskData = data;
      }
    });
  }

  changeData(list: data.dataList) {
    this.contactData = list;
    if (!list.status) {
      this.getTaskData.data.forEach((a: data.dataList) => {
        a.status = false;
      });
    }
    list.status = !list.status;
  }
}
