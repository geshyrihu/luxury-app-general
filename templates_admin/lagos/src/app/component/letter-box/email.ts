import { Component } from '@angular/core';

import { EmailLeftAside } from './email-left-aside/email-left-aside';

@Component({
  selector: 'app-email',
  templateUrl: './email.html',
  styleUrls: ['./email.scss'],
  imports: [EmailLeftAside],
})
export class Email {}
