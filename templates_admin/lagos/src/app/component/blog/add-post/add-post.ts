import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AngularEditorModule } from '@kolkov/angular-editor';
import { NgSelectModule } from '@ng-select/ng-select';
import { DropzoneConfigInterface, DropzoneModule } from 'ngx-dropzone-wrapper';
import { NgxEditorModule } from 'ngx-editor';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.html',
  styleUrls: ['./add-post.scss'],
  imports: [AngularEditorModule, FormsModule, DropzoneModule, NgSelectModule, NgxEditorModule],
})
export class AddPost {
  public htmlContent = '';
  public selectedCityIds: string[] = [];
  public selectedCityId: number = 0;
  public selectedUserIds: number[] = [];

  public config: DropzoneConfigInterface = {
    url: 'https://httpbin.org/post',
    addRemoveLinks: true,
    parallelUploads: 1,
  };

  public cities2 = [
    { id: 1, name: 'LifeStyle' },
    { id: 2, name: 'Travel' },
  ];
}
