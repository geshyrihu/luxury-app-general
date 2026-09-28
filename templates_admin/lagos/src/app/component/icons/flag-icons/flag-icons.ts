import { UpperCasePipe } from '@angular/common';
import { Component, inject } from '@angular/core';

import { ToastrService } from 'ngx-toastr';

import { icon } from '../../../shared/data/data/icons/flag-icon';

@Component({
  selector: 'app-flag-icons',
  templateUrl: './flag-icons.html',
  styleUrls: ['./flag-icons.scss'],
  imports: [UpperCasePipe],
})
export class FlagIcons {
  public icon = icon;
  public detail: boolean = false;
  public flag: string;
  public val: string;

  public toastrService = inject(ToastrService);

  toggleWithInfo(icon: string) {
    this.detail = true;
    this.flag = icon;
    this.val = '<i class="flag-icon flag-icon-' + icon + '"></i>';
  }

  copyText(val: string) {
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = '<i class="flag-icon flag-icon-' + val + '"></i>';
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
