import { Component } from '@angular/core';

import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

import { FileUpload } from './file-upload/file-upload';

@Component({
  selector: 'app-create-new',
  templateUrl: './create-new.html',
  styleUrls: ['./create-new.scss'],
  imports: [FileUpload],
})
export class CreateNew {
  public model: NgbDateStruct;
  public model2: NgbDateStruct;
}
