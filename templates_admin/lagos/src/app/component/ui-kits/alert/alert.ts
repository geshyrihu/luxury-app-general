import { Component } from '@angular/core';

import { AdditionalContent } from './additional-content/additional-content';
import { AlertsWithTextActions } from './alerts-with-text-actions/alerts-with-text-actions';
import { DarkTheme } from './dark-theme/dark-theme';
import { DismissingDarkAlert } from './dismissing-dark-alert/dismissing-dark-alert';
import { DismissingLightAlert } from './dismissing-light-alert/dismissing-light-alert';
import { LeftBorderAlert } from './left-border-alert/left-border-alert';
import { LightTheme } from './light-theme/light-theme';
import { LiveAlert } from './live-alert/live-alert';
import { OutlineDarkLightAlerts } from './outline-dark-light-alerts/outline-dark-light-alerts';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.html',
  styleUrls: ['./alert.scss'],
  imports: [
    DismissingDarkAlert,
    DismissingLightAlert,
    LiveAlert,
    AdditionalContent,
    AlertsWithTextActions,
    DarkTheme,
    LeftBorderAlert,
    LightTheme,
    OutlineDarkLightAlerts,
  ],
})
export class Alert {}
