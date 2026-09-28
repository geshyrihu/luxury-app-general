import { Component } from '@angular/core';

import { PersonalDetails } from './personal-details/personal-details';
import { UploadFiles } from './upload-files/upload-files';
import { YourEducation } from './your-education/your-education';
import { YourExperience } from './your-experience/your-experience';

@Component({
  selector: 'app-apply-form',
  templateUrl: './apply-form.html',
  styleUrls: ['./apply-form.scss'],
  imports: [PersonalDetails, UploadFiles, YourEducation, YourExperience],
})
export class ApplyForm {}
