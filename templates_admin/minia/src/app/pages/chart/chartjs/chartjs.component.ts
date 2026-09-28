import { Component, OnInit } from '@angular/core';
import { ChartType } from './chartjs.model';
import { Chart, DoughnutController, ArcElement, Title, Tooltip, Legend, PolarAreaController, RadarController, BarController, PieController, RadialLinearScale, PointElement, LineController, CategoryScale, LinearScale, LineElement, BarElement } from 'chart.js';

import { lineAreaChart, lineBarChart, pieChart, donutChart, polarChart, radarChart } from './data';
Chart.register(DoughnutController,PolarAreaController,RadarController,BarController,PieController,RadialLinearScale,PointElement,ArcElement,LineController,CategoryScale,LinearScale,LineElement,BarElement)
@Component({
    selector: 'app-chartjs',
    templateUrl: './chartjs.component.html',
    styleUrls: ['./chartjs.component.scss'],
    standalone: false
})

/**
 * Chart Js Component
 */
export class ChartjsComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  // Line Chart
  lineAreaChart!: ChartType;
  lineBarChart!: ChartType;
  pieChart!: ChartType;
  donutChart!: ChartType;
  polarChart!: ChartType;
  radarChart!: ChartType;

  constructor() { }

  ngOnInit(): void {
    /**
     * BreadCrumb Set
     */
    this.breadCrumbItems = [
      { label: 'Charts' },
      { label: 'Chartjs', active: true }
    ];
    /**
    * Fetches the data
    */
    this._fetchData();
  }
  /**
  * Fetch chart's data
  */
  private _fetchData() {
    // Line Chart data
    this.lineAreaChart = lineAreaChart;
    this.lineBarChart = lineBarChart;
    this.pieChart = pieChart;
    this.donutChart = donutChart;
    this.polarChart = polarChart;
    this.radarChart = radarChart;
  }
}
