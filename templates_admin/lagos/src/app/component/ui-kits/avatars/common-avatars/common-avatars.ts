import { Component, input } from '@angular/core';

import { avatar } from '../../../../shared/data/data/ui-kits/avatars';

@Component({
  selector: 'app-common-avatars',
  templateUrl: './common-avatars.html',
  styleUrls: ['./common-avatars.scss'],
  imports: [],
})
export class CommonAvatars {
  readonly data = input<avatar>();
}
