import { Component, inject } from '@angular/core';

import { ToastrService } from 'ngx-toastr';

import { FeatherIcons } from '../../../shared/components/feather-icons/feather-icons';
import { allIcon } from '../../../shared/data/data/icons/font-awasome';

@Component({
  selector: 'app-feather-icon',
  templateUrl: './feather-icon.html',
  styleUrls: ['./feather-icon.scss'],
  imports: [FeatherIcons],
})
export class FeatherIcon {
  public feather = allIcon.feather;
  public detail: boolean = false;
  public flag: string;
  public val: string;
  public icon: string;
  public toastrService = inject(ToastrService);

  toggleWithInfo(icon: string) {
    this.detail = true;
    this.icon = icon;
    this.val = '<app-feather-icon [icon]="' + icon + '"></app-feather-icon>';
  }
  copyText(val: string) {
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = '<app-feather-icon [icon]="' + val + '"></app-feather-icon>>';
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
