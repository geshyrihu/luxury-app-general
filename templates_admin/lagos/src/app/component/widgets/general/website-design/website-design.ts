import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import * as data from '../../../../shared/data/data/dashboard/project';
import { ClickOutsideDirective } from '../../../../shared/directive/click-outside.directive';

@Component({
  selector: 'app-website-design',
  templateUrl: './website-design.html',
  styleUrls: ['./website-design.scss'],
  imports: [ClickOutsideDirective, RouterModule],
})
export class WebsiteDesign {
  public websiteDesign = data.websiteDesign;
  public isShow: boolean = false;

  clickoutSide(): void {
    this.isShow = false;
  }
}
