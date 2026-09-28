import { Component, inject } from '@angular/core';

import { ToastrService } from 'ngx-toastr';

import { allIcon } from '../../../shared/data/data/icons/font-awasome';

@Component({
  selector: 'app-font-awesome',
  templateUrl: './font-awesome.html',
  styleUrls: ['./font-awesome.scss'],
  imports: [],
})
export class FontAwesome {
  public fontawesome = allIcon.fontawesome;
  public detail: boolean = false;
  public icon: string;
  public val: string;

  public toastrService = inject(ToastrService);

  toggleWithInfo(icon: string) {
    this.detail = true;
    this.icon = icon;
    this.val = '<i class="fa fa-' + icon + '"></i>';
  }

  copyText(val: string) {
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = '<i class="fa fa-' + val + '"></i>';
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.toastrService.show('<p class="mb-0 mt-1">Code Copied to clipboard</p>', '', {
      closeButton: true,
      enableHtml: true,
      positionClass: 'toast-bottom-right',
    });
  }
}
