import { TitleCasePipe } from '@angular/common';
import { Component } from '@angular/core';

import * as Data from '../../../shared/data/data/buttons/buttons';

@Component({
  selector: 'app-buttons-edge',
  templateUrl: './buttons-edge.html',
  styleUrls: ['./buttons-edge.scss'],
  imports: [TitleCasePipe],
})
export class ButtonsEdge {
  public edgeButtonData = Data.edgeButtonData;
  public edgeOutlinedButtonsData = Data.edgeOutlinedButtonsData;
  public edgeGradienButtonData = Data.edgeGradienButtonData;
}
