import { Component, inject, output } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DropzoneModule, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';

import { CommonSvgIcon } from '../../../../shared/components/common-svg-icon/common-svg-icon';

@Component({
  selector: 'app-product-gallery',
  templateUrl: './product-gallery.html',
  styleUrls: ['./product-gallery.scss'],
  imports: [DropzoneModule, ReactiveFormsModule, FormsModule, CommonSvgIcon],
})
export class ProductGallery {
  readonly activeSteps = output<number>();
  public image: File[] = [];
  public gallery: File[] = [];
  public activeStep: number = 2;
  private fb = inject(FormBuilder);
  public text =
    ' <div class="dz-message needsclick"><i class="icon-cloud-up"></i><p>Drop files here or click to upload.</p></div>';

  validationError: string | null = null;

  onFileDrop(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      console.warn(Array.from(input.files));
    }
  }
  next() {
    const number = this.activeStep + 1;
    this.activeSteps.emit(number);
  }

  previous() {
    const number = this.activeStep - 1;
    this.activeSteps.emit(number);
  }

  public config: DropzoneConfigInterface = {
    url: 'https://httpbin.org/post',
    addRemoveLinks: true,
    parallelUploads: 1,
  };

  public config2: DropzoneConfigInterface = {
    acceptedFiles: 'image/*,gif',
    url: 'https://httpbin.org/post',
    addRemoveLinks: true,
  };
}
