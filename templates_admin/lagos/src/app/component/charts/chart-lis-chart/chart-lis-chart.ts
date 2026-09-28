import { Component } from '@angular/core';

import { AdvancedSMILAnimations } from './advanced-smil-animations/advanced-smil-animations';
import { AnimatingADonutWithSvg } from './animating-a-donut-with-svg/animating-a-donut-with-svg';
import { BiPolarBarChart } from './bi-polar-bar-chart/bi-polar-bar-chart';
import { BiPolarLineChart } from './bi-polar-line-chart/bi-polar-line-chart';
import { FilledHolesInData } from './filled-holes-in-data/filled-holes-in-data';
import { HolesInData } from './holes-in-data/holes-in-data';
import { HorizontalBarChart } from './horizontal-bar-chart/horizontal-bar-chart';
import { LineChartWithArea } from './line-chart-with-area/line-chart-with-area';
import { SimpleLineChart } from './simple-line-chart/simple-line-chart';
import { StackedBarChart } from './stacked-bar-chart/stacked-bar-chart';
import { SVGPathAnimation } from './svg-path-animation/svg-path-animation';
import { XremeResponsiveConfiguration } from './xreme-responsive-configuration/xreme-responsive-configuration';

@Component({
  selector: 'app-chart-lis-chart',
  templateUrl: './chart-lis-chart.html',
  styleUrls: ['./chart-lis-chart.scss'],
  imports: [
    AdvancedSMILAnimations,
    AnimatingADonutWithSvg,
    BiPolarBarChart,
    HolesInData,
    BiPolarLineChart,
    FilledHolesInData,
    HorizontalBarChart,
    LineChartWithArea,
    SimpleLineChart,
    StackedBarChart,
    SVGPathAnimation,
    XremeResponsiveConfiguration,
  ],
})
export class ChartLisChart {}
