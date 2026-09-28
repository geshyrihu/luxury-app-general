import { Component } from '@angular/core';

import { commonEducationData } from '../../../../shared/data/data/dashboard/education';

@Component({
  selector: 'app-comman-education-data',
  templateUrl: './comman-education-data.html',
  styleUrls: ['./comman-education-data.scss'],
  imports: [],
})
export class CommanEducationData {
  public commonEducationData = commonEducationData;
}
