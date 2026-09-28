import { Component } from '@angular/core';

import { customContentData } from '../../../../shared/data/data/ui-kits/list';

@Component({
  selector: 'app-custom-content-lists',
  templateUrl: './custom-content-lists.html',
  styleUrls: ['./custom-content-lists.scss'],
  imports: [],
})
export class CustomContentLists {
  public customContentData = customContentData;
}
