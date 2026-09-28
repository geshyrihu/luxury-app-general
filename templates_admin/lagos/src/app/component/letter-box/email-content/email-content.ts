import { NgClass, SlicePipe } from '@angular/common';
import { Component, SimpleChanges, input } from '@angular/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { InterviewMail } from './interview-mail/interview-mail';
import { CommonSvgIcon } from '../../../shared/components/common-svg-icon/common-svg-icon';
import { email, tabData } from '../../../shared/data/data/ecommerce/email';
import * as data from '../../../shared/data/data/ecommerce/email';

@Component({
  selector: 'app-email-content',
  templateUrl: './email-content.html',
  styleUrls: ['./email-content.scss'],
  imports: [NgbModule, InterviewMail, CommonSvgIcon, NgClass, SlicePipe],
})
export class EmailContent {
  public getEmailData: email;
  public emailFilter = data.emailFilter;
  public isShow: boolean = false;
  public tabData = tabData;
  public openTab: string = 'promotion';
  public isOpne: boolean = false;
  public pageSize = 8;
  public currentPage = 1;
  readonly selectedId = input<number>();

  ngOnInit() {
    this.emailFilter.map(data => {
      if (data.status) {
        this.getEmailData = data;
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    let id = changes['selectedId'].currentValue;
    this.emailFilter.map(data => {
      if (data.id === id) {
        this.getEmailData = data;
      }
    });
  }

  clickoutSide(): void {
    this.isShow = false;
  }

  bookMark(id: number) {
    this.emailFilter.forEach(list => {
      list.data.forEach(items => {
        if (items.id === id) {
          items.active = !items.active;
          items.isOpens = !items.isOpens;
        }
      });
    });
  }

  tabActive(value: string) {
    this.openTab = value;
  }

  deleteEmail(index: number, name: string) {
    this.emailFilter.forEach(data => {
      if (data.id == this.getEmailData.id) {
        data.data.forEach(element => {
          if (this.emailFilter)
            if (element.name == name) {
              data.data.splice(index, 1);
            }
        });
      }
    });
  }

  isFalse(value: boolean) {
    this.isOpne = value;
  }
}
