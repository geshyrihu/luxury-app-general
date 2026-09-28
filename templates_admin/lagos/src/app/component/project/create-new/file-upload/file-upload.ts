import { Component } from '@angular/core';

import { DropzoneModule, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.html',
  styleUrls: ['./file-upload.scss'],
  imports: [DropzoneModule],
})
export class FileUpload {
  public Config: DropzoneConfigInterface = {
    clickable: true,
    url: 'https://httpbin.org/post',
    autoProcessQueue: true,
    addRemoveLinks: true,
    parallelUploads: 1,
  };

  public text =
    ' <div class="dz-message needsclick"><i class="icon-cloud-up"></i><p>Drop files here or click to upload.</p></div>';
}
