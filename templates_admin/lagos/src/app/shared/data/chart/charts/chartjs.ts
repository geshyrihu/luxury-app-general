import { ChartDataset, ChartOptions as ChartJSOptions, ChartType } from 'chart.js';

var primary = localStorage.getItem('primary_color') || '#6f5a99';
var secondary = localStorage.getItem('secondary_color') || '#e24175';

export const barChart = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  responsive: false,
  datasets: [
    {
      label: 'My First dataset',
      backgroundColor: 'rgba(111, 90, 153, 0.4)',
      borderColor: primary,
      borderWidth: 2,
      data: [35, 59, 80, 81, 56, 55, 40],
    },
    {
      label: 'My Second dataset',
      borderColor: secondary,
      backgroundColor: 'rgba(247, 49, 100, 0.4)',
      borderWidth: 2,
      data: [28, 48, 40, 19, 86, 27, 90],
    },
  ],
  barOptions: [
    {
      scaleBeginAtZero: true,
      scaleShowGridLines: true,
      scaleGridLineColor: 'rgba(0,0,0,0.1)',
      scaleGridLineWidth: 1,
      scaleShowHorizontalLines: true,
      scaleShowVerticalLines: true,
      barShowStroke: true,
      barStrokeWidth: 2,
      barValueSpacing: 5,
      barDatasetSpacing: 1,
    },
  ],
};

// LineGraph Chart

export var lineGraphLabels: string[] = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
];
export var lineGraphType: ChartType = 'line';
export var lineGraphLegend = false;
export var lineGraphData: ChartDataset[] = [
  {
    label: 'My First dataset',
    fill: true,
    backgroundColor: 'rgba(111, 90, 153, 0.3)',
    borderColor: primary,
    pointBackgroundColor: primary,
    borderWidth: 2,
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: '#000',
    data: [10, 59, 80, 81, 56, 55, 40],
  },
  {
    label: 'My Second dataset',
    fill: true,
    backgroundColor: 'rgba(247, 49, 100, 0.3)',
    borderColor: secondary,
    pointBackgroundColor: secondary,
    pointBorderColor: '#fff',
    borderWidth: 2,
    pointHoverBorderColor: '#000',
    pointHoverBackgroundColor: 'rgba(30, 166, 236, 1)',
    data: [28, 48, 40, 19, 86, 27, 90],
  },
];
export var lineGraphOptions: ChartJSOptions<'line'> = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
    },
  },
  scales: {
    x: {
      grid: {
        display: true,
        color: 'rgba(0,0,0,.05)',
      },
    },
    y: {
      grid: {
        display: true,
        color: 'rgba(0,0,0,.05)',
      },
    },
  },
  elements: {
    line: {
      tension: 0.4,
      borderWidth: 2,
      fill: true,
    },
    point: {
      radius: 4,
      borderWidth: 1,
      hitRadius: 20,
    },
  },
};

// RadarGraph Chart
export var radarGraphOptions: ChartJSOptions<'radar'> = {
  responsive: true,
  maintainAspectRatio: false,
  elements: {
    line: {
      borderWidth: 2,
    },
  },
};
export var radarGraphLabels: string[] = ['Ford', 'Chevy', 'Toyota', 'Honda', 'Mazda'];
export var radarGraphType: ChartType = 'radar';
export var radarGraphLegend = false;
export var radarGraphData: ChartDataset<'radar'>[] = [
  {
    label: 'My First dataset',
    fill: true,
    backgroundColor: 'rgba(92, 95, 206, 0.4)',
    borderColor: primary,
    pointBackgroundColor: primary,
    pointBorderColor: primary,
    pointHoverBackgroundColor: primary,
    pointHoverBorderColor: 'rgba(255, 206, 0, 0.4)',
    data: [12, 3, 5, 18, 7],
  },
];

// lineChart
export var lineChartOptions: ChartJSOptions<'line'> = {
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      grid: {
        display: true,
      },
    },
  },
  responsive: true,
};
export var lineChartLabels: string[] = ['', '10', '20', '30', '40', '50', '60', '70', '80'];
export var lineChartType: ChartType = 'line';
export var lineChartLegend = false;
export var lineChartData: ChartDataset<'line'>[] = [
  {
    backgroundColor: 'rgba(81, 187, 37, 0.2)',
    fill: true,
    pointBackgroundColor: '#717171',
    borderColor: '#717171',
    data: [10, 20, 40, 30, 0, 20, 10, 30, 10],
    borderWidth: 2,
  },
  {
    backgroundColor: 'rgba(247, 49, 100, 0.2)',
    fill: true,
    borderColor: secondary,
    pointBackgroundColor: secondary,
    data: [20, 40, 10, 20, 40, 30, 40, 10, 20],
    borderWidth: 2,
  },
  {
    backgroundColor: 'rgba(111, 90, 153, 0.2)',
    fill: true,
    borderColor: primary,
    pointBackgroundColor: primary,
    data: [60, 10, 40, 30, 80, 30, 20, 90, 0],
    borderWidth: 2,
  },
];

// Doughnut
export var doughnutChartLegend = false;
export var doughnutChartLabels: string[] = ['Red', 'Blue', 'Yellow', 'Green', 'Purple'];
export var doughnutChartData: ChartDataset<'doughnut'>[] = [
  {
    label: 'My First Dataset',
    data: [300, 50, 100],
    backgroundColor: [primary, secondary, '#51bb25'],
  },
];
export var doughnutChartColors = [{ backgroundColor: [primary, secondary, '#51bb25'] }];
export var doughnutChartType: ChartType = 'doughnut';
export var doughnutChartOptions: ChartJSOptions<'doughnut'> = {
  animation: false,
  responsive: true,
  maintainAspectRatio: false,
};

// polar Chart
export var polarChartLabels: string[] = ['Yellow', 'Sky', 'Black', 'Grey', 'Dark Grey'];
export var polarChartType: ChartType = 'polarArea';
export var polarChartLegend = false;
export var polarChartOptions: ChartJSOptions<'polarArea'> = {
  responsive: true,
  scales: {
    r: {
      beginAtZero: true,
      grid: {
        circular: true,
      },
      angleLines: {
        display: true,
      },
      pointLabels: {
        display: true,
      },
    },
  },
  animation: {
    animateRotate: true,
    animateScale: false,
  },
  plugins: {
    legend: {
      display: polarChartLegend,
    },
  },
};
export var polarChartColors = [{ backgroundColor: [primary, secondary] }];
export var polarChartData: ChartDataset<'polarArea'>[] = [
  {
    data: [300, 50, 100, 40, 120],
    backgroundColor: [primary, secondary, '#61ae41', '#a927f9', secondary],
    borderColor: '#fff',
  },
];
