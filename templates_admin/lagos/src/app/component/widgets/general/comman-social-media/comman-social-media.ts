import { Component, input } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { SocialMediaChartOptions } from '../../../../shared/interface/widgets/chart';

@Component({
  selector: 'app-comman-social-media',
  templateUrl: './comman-social-media.html',
  styleUrls: ['./comman-social-media.scss'],
  imports: [NgApexchartsModule],
})
export class CommanSocialMedia {
  readonly item = input<SocialMediaChartOptions>();
}
