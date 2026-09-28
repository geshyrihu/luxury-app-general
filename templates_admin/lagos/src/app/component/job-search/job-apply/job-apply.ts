import { Component } from '@angular/core';

import { JobFilter } from '../job-filter/job-filter';
import { ApplyForm } from './apply-form/apply-form';

@Component({
  selector: 'app-job-apply',
  templateUrl: './job-apply.html',
  styleUrls: ['./job-apply.scss'],
  imports: [JobFilter, ApplyForm],
})
export class JobApply {}
