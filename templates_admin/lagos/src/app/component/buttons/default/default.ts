import { TitleCasePipe } from '@angular/common';
import { Component } from '@angular/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import * as Data from '../../../shared/data/data/buttons/buttons';

@Component({
  selector: 'app-default',
  templateUrl: './default.html',
  styleUrls: ['./default.scss'],
  imports: [NgbModule, TitleCasePipe],
})
export class Default {
  public defaultButtonsData = Data.defaultButtonsData;
  public outlinedButtonsData = Data.outlinedButtonsData;
  public gradienButtonData = Data.gradienButtonData;
}
