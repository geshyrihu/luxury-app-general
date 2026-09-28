import { Component, input } from '@angular/core';

@Component({
  selector: 'app-common-svg-icon',
  templateUrl: './common-svg-icon.html',
  styleUrls: ['./common-svg-icon.scss'],
})
export class CommonSvgIcon {
  public readonly icon = input<string>();
  public readonly class = input<string>();
}
