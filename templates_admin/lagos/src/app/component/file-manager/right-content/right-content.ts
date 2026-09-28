import { Component } from '@angular/core';

import { FeatherIcons } from '../../../shared/components/feather-icons/feather-icons';
import * as data from '../../../shared/data/data/file-maganer/file-maganer';

@Component({
  selector: 'app-right-content',
  templateUrl: './right-content.html',
  styleUrls: ['./right-content.scss'],
  imports: [FeatherIcons],
})
export class RightContent {
  public quickAccess = data.quickAccess;
  public folders = data.folders;
  public files = data.files;
}
