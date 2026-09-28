import { Component, input } from '@angular/core';

import { CommonSvgIcon } from '../../../../shared/components/common-svg-icon/common-svg-icon';

export interface DashboardCard {
  class: string;
  name: string;
  point: string;
  icons: string;
  image?: images[];
  rate: string;
}

export interface images {
  url: string;
}

@Component({
  selector: 'app-client-data',
  templateUrl: './client-data.html',
  styleUrl: './client-data.scss',
  imports: [CommonSvgIcon],
})
export class ClientData {
  readonly data = input<DashboardCard>();
}
