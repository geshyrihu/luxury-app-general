import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgbDateStruct, NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-your-experience',
  templateUrl: './your-experience.html',
  styleUrls: ['./your-experience.scss'],
  imports: [NgbModule, FormsModule],
})
export class YourExperience {
  public model: NgbDateStruct;
  public model2: NgbDateStruct;
}
