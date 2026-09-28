import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import * as data from '../../../../shared/data/chart/widgets/apex-chart';

@Component({
  selector: 'app-crypto-annotations',
  templateUrl: './crypto-annotations.html',
  styleUrls: ['./crypto-annotations.scss'],
  imports: [NgApexchartsModule],
})
export class CryptoAnnotations {
  public cryptoAnotation = data.cryptoAnotation;
}
