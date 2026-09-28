import { Component } from '@angular/core';

import * as data from '../../../../shared/data/data/user/user';

@Component({
  selector: 'app-add-update-projects',
  templateUrl: './add-update-projects.html',
  styleUrls: ['./add-update-projects.scss'],
  imports: [],
})
export class AddUpdateProjects {
  public addUpdateData = data.addUpdateData;
}
