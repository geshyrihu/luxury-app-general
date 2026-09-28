import { Component } from '@angular/core';

import { CheckboxList } from './checkbox-list/checkbox-list';
import { ContextualClasses } from './contextual-classes/contextual-classes';
import { CustomContentLists } from './custom-content-lists/custom-content-lists';
import { DisabledLists } from './disabled-lists/disabled-lists';
import { HorizontalLists } from './horizontal-lists/horizontal-lists';
import { JavaScriptBehavior } from './java-script-behavior/java-script-behavior';
import { ListsWithNumbers } from './lists-with-numbers/lists-with-numbers';
import { NumberedBadgeLists } from './numbered-badge-lists/numbered-badge-lists';
import { Radios } from './radios/radios';
import { ScrollableLists } from './scrollable-lists/scrollable-lists';
import * as data from '../../../shared/data/data/ui-kits/list';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.html',
  styleUrls: ['./lists.scss'],
  imports: [
    CheckboxList,
    ContextualClasses,
    CustomContentLists,
    DisabledLists,
    HorizontalLists,
    JavaScriptBehavior,
    ListsWithNumbers,
    NumberedBadgeLists,
    Radios,
    ScrollableLists,
  ],
})
export class Lists {
  public commanListData = data.commanList;
}
