import { Component } from '@angular/core';

import { FeatherIcons } from '../../../../shared/components/feather-icons/feather-icons';
import { stackingToastData } from '../../../../shared/data/data/toastr/toastr';

@Component({
  selector: 'app-stacking-toasts',
  templateUrl: './stacking-toasts.html',
  styleUrls: ['./stacking-toasts.scss'],
  imports: [FeatherIcons],
})
export class StackingToasts {
  public stackingToastData = stackingToastData;
  public isShow: boolean = true;

  close(id: number) {
    const close = stackingToastData.filter(data => {
      return data.id === id;
    });
    close[0].show = false;
  }
}
