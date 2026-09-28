import { Component } from '@angular/core';

import { DropzoneConfigInterface, DropzoneModule } from 'ngx-dropzone-wrapper';

@Component({
  selector: 'app-default-file-upload',
  templateUrl: './default-file-upload.html',
  styleUrls: ['./default-file-upload.scss'],
  imports: [DropzoneModule],
})
export class DefaultFileUpload {
  public config: DropzoneConfigInterface = {
    url: 'https://httpbin.org/post',
    addRemoveLinks: true,
  };
  public text =
    ' <div class="dz-message needsclick"><i class="icon-cloud-up"></i><p>Drop files here or click to upload.</p></div>';
}
