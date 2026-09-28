import { Component } from '@angular/core';

import { DropzoneConfigInterface, DropzoneModule } from 'ngx-dropzone-wrapper';

@Component({
  selector: 'app-single-file-upload',
  templateUrl: './single-file-upload.html',
  styleUrls: ['./single-file-upload.scss'],
  imports: [DropzoneModule],
})
export class SingleFileUpload {
  public config: DropzoneConfigInterface = {
    url: 'https://httpbin.org/post',
    clickable: true,
    uploadMultiple: false,
    maxFiles: 1,
    addRemoveLinks: true,
  };

  public text =
    ' <div class="dz-message needsclick"><i class="icon-cloud-up"></i><p>Drop files here or click to upload.</p></div>';
}
