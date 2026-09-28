import { Component } from '@angular/core';

import { translucentToastsData } from '../.././../../shared/data/data/toastr/toastr';
import { FeatherIcons } from '../../../../shared/components/feather-icons/feather-icons';

@Component({
  selector: 'app-translucent-toasts',
  templateUrl: './translucent-toasts.html',
  styleUrls: ['./translucent-toasts.scss'],
  imports: [FeatherIcons],
})
export class TranslucentToasts {
  public translucentToastsData = translucentToastsData;
  public isShow: boolean = true;

  close(id: number) {
    const close = translucentToastsData.filter(data => {
      return data.id === id;
    });
    close[0].show = false;
  }
}
