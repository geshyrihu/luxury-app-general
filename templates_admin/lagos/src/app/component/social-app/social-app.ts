import { NgClass } from '@angular/common';
import { Component } from '@angular/core';

import { About } from './about/about';
import { Photo } from './photo/photo';
import { TimeLine } from './time-line/time-line';
import { UserCards } from '../users/user-cards/user-cards';

@Component({
  selector: 'app-social-app',
  templateUrl: './social-app.html',
  styleUrls: ['./social-app.scss'],
  imports: [About, TimeLine, Photo, UserCards, NgClass],
})
export class SocialApp {
  public active = 1;
  public openTab: string = 'timeline';

  public tabbed(val: string) {
    this.openTab = val;
  }
}
