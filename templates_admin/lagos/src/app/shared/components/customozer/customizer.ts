import { NgClass } from '@angular/common';
import { Component, inject, TemplateRef } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ColorPicker } from './color-picker/color-picker';
import { QuickOption } from './quick-option/quick-option';
import { LayoutService } from '../../services/layout.service';

@Component({
  selector: 'app-customizer',
  imports: [ColorPicker, QuickOption, NgClass],
  templateUrl: './customizer.html',
  styleUrls: ['./customizer.scss'],
})
export class Customizer {
  private modalService = inject(NgbModal);
  public layoutService = inject(LayoutService);

  customize(val: string) {
    this.layoutService.customize = val;
  }

  openModal(popup: TemplateRef<NgbModal>) {
    this.modalService.open(popup, { backdropClass: 'dark-modal', centered: true });
  }

  copyText(data: object) {
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = JSON.stringify(data);
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }
}
