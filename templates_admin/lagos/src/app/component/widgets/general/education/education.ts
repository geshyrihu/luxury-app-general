import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { commonEducationData } from '../../../../shared/data/data/dashboard/education';

@Component({
  selector: 'app-education',
  imports: [CommonModule],
  templateUrl: './education.html',
  styleUrl: './education.scss',
})
export class Education {
  public commonEducationData = commonEducationData;
}
