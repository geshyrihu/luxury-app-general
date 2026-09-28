import { Component } from '@angular/core';

import { DefaultFileUpload } from './default-file-upload/default-file-upload';
import { ImagePreview } from './image-preview/image-preview';
import { MultiFileUpload } from './multi-file-upload/multi-file-upload';
import { SingleFileUpload } from './single-file-upload/single-file-upload';

@Component({
  selector: 'app-dropzone',
  templateUrl: './dropzone.html',
  styleUrls: ['./dropzone.scss'],
  imports: [DefaultFileUpload, MultiFileUpload, SingleFileUpload, ImagePreview],
})
export class Dropzone {}
