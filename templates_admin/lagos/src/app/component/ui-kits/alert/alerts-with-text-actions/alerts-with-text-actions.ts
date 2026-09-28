import { Component } from '@angular/core';

import * as Data from '../../../../shared/data/data/ui-kits/alert';

@Component({
  selector: 'app-alerts-with-text-actions',
  templateUrl: './alerts-with-text-actions.html',
  styleUrls: ['./alerts-with-text-actions.scss'],
  imports: [],
})
export class AlertsWithTextActions {
  public alertIconTextAlertData = Data.alertIconTextAlertData;

  closed(alertData: Data.alertIconTextAlert) {
    this.alertIconTextAlertData.splice(this.alertIconTextAlertData.indexOf(alertData), 1);
  }
}
