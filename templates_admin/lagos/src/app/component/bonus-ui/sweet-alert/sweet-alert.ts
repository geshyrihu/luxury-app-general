import { Component } from '@angular/core';

import { AJAXRequestMovie } from './ajax-request-movie/ajax-request-movie';
import { AutoCloseTimer } from './auto-close-timer/auto-close-timer';
import { BasicExample } from './basic-example/basic-example';
import { DangerAlert } from './danger-alert/danger-alert';
import { InfoAlert } from './info-alert/info-alert';
import { PikachuAlert } from './pikachu-alert/pikachu-alert';
import { QuestionsAlert } from './questions-alert/questions-alert';
import { SuccessMessage } from './success-message/success-message';
import { TitleWithText } from './title-with-text/title-with-text';
import { UsernameAlert } from './username-alert/username-alert';
import { WarningAlert } from './warning-alert/warning-alert';
import { WarningMode } from './warning-mode/warning-mode';

@Component({
  selector: 'app-sweet-alert',
  templateUrl: './sweet-alert.html',
  styleUrls: ['./sweet-alert.scss'],
  imports: [
    AJAXRequestMovie,
    AutoCloseTimer,
    BasicExample,
    DangerAlert,
    InfoAlert,
    PikachuAlert,
    QuestionsAlert,
    SuccessMessage,
    TitleWithText,
    UsernameAlert,
    WarningMode,
    WarningAlert,
  ],
})
export class SweetAlert {}
