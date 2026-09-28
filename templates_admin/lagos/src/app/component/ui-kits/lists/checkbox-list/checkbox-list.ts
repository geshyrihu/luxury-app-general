import { Component } from '@angular/core';

import { chechBox } from '../../../../shared/data/data/ui-kits/list';

@Component({
  selector: 'app-checkbox-list',
  templateUrl: './checkbox-list.html',
  styleUrls: ['./checkbox-list.scss'],
  imports: [],
})
export class CheckboxList {
  public chechBox = chechBox;
}
