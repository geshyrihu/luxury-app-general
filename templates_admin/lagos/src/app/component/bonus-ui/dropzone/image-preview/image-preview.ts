import { Component } from '@angular/core';

import { DropzoneConfigInterface, DropzoneModule } from 'ngx-dropzone-wrapper';

@Component({
  selector: 'app-image-preview',
  templateUrl: './image-preview.html',
  styleUrls: ['./image-preview.scss'],
  imports: [DropzoneModule],
})
export class ImagePreview {
  public config: DropzoneConfigInterface = {
    clickable: true,
    url: 'https://httpbin.org/post',
    acceptedFiles: 'image/*',
    addRemoveLinks: true,
  };

  public text =
    ' <div class="dz-message needsclick"><i class="icon-cloud-up"></i><p>Drop files here or click to upload.</p></div>';
}
