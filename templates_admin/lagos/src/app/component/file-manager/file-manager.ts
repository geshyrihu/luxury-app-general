import { NgClass } from '@angular/common';
import { Component } from '@angular/core';

import { RightContent } from './right-content/right-content';
import { FeatherIcons } from '../../shared/components/feather-icons/feather-icons';
import * as data from '../../shared/data/data/file-maganer/file-maganer';
import { ClickOutsideDirective } from '../../shared/directive/click-outside.directive';

@Component({
  selector: 'app-file-manager',
  templateUrl: './file-manager.html',
  styleUrls: ['./file-manager.scss'],
  imports: [ClickOutsideDirective, FeatherIcons, RightContent, NgClass],
})
export class FileManager {
  public sidebar = data.sidebarData;
  public isShow: boolean = false;

  outSide() {
    this.isShow = false;
  }
}
