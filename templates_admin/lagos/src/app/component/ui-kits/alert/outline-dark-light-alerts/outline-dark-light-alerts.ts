import { Component } from '@angular/core';

import { FeatherIcons } from '../../../../shared/components/feather-icons/feather-icons';
import * as Data from '../../../../shared/data/data/ui-kits/alert';

@Component({
  selector: 'app-outline-dark-light-alerts',
  templateUrl: './outline-dark-light-alerts.html',
  styleUrls: ['./outline-dark-light-alerts.scss'],
  imports: [FeatherIcons],
})
export class OutlineDarkLightAlerts {
  public outLinedAlert = Data.outLinedAlertData;

  closed(alertData: Data.outLinedAlert) {
    this.outLinedAlert.splice(this.outLinedAlert.indexOf(alertData), 1);
  }
}
