import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgbDateStruct, NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-your-education',
  templateUrl: './your-education.html',
  styleUrls: ['./your-education.scss'],
  imports: [NgbModule, FormsModule],
})
export class YourEducation {
  public model: NgbDateStruct;
  public model2: NgbDateStruct;
}
