import { TitleCasePipe } from '@angular/common';
import { Component } from '@angular/core';

import * as data from '../../../../shared/data/data/ui-kits/list';

@Component({
  selector: 'app-contextual-classes',
  templateUrl: './contextual-classes.html',
  styleUrls: ['./contextual-classes.scss'],
  imports: [TitleCasePipe],
})
export class ContextualClasses {
  public contextualClassListData = data.contextualClassListData;
}
