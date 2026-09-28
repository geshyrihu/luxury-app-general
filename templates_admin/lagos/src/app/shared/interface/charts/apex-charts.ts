import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexStroke,
  ApexXAxis,
  ApexFill,
  ApexTooltip,
  ApexTitleSubtitle,
  ApexTheme,
  ApexMarkers,
  ApexAnnotations,
  ApexGrid,
  ApexResponsive,
} from 'ng-apexcharts';

export interface BasicChart {
  series: ApexAxisChartSeries;
  colors: string[];
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  labels: string[];
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  legend: ApexLegend;
  title: ApexTitleSubtitle;
  subtitle: ApexTitleSubtitle;
}

export interface ColumnChart {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  colors: string[];
}

export interface AreaSpalineChart {
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  series: ApexAxisChartSeries;
  xaxis: ApexXAxis;
  tooltip: ApexTooltip;
  colors: string[];
}

export interface BarChartConfig {
  chart: {
    height: number;
    type: 'bar';
    toolbar: { show: boolean };
  };
  plotOptions: {
    bar: { horizontal: boolean };
  };
  dataLabels: { enabled: boolean };
  series: { data: number[] }[];
  xaxis: { categories: string[] };
  colors: string[];
}

export interface BubbleChart {
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  series: ApexAxisChartSeries;
  fill: ApexFill;
  title: ApexTitleSubtitle;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  theme: ApexTheme;
  stroke: ApexStroke;
  colors: string[];
}

export interface StepLineChart {
  chart: ApexChart;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  series: ApexAxisChartSeries;
  title: ApexTitleSubtitle;
  markers: ApexMarkers;
  colors: string[];
}

export interface ColumnChart2 {
  annotations: ApexAnnotations;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  grid: ApexGrid;
  series: ApexAxisChartSeries;
  title: ApexTitleSubtitle;
  labels: string[];
  xaxis: ApexXAxis;
  colors: string[];
}

export interface PieChart {
  chart: ApexChart;
  labels: string[];
  series: number[];
  responsive: ApexResponsive[];
  colors: string[];
}

export interface DonutChart {
  chart: ApexChart;
  series: number[];
  responsive: ApexResponsive[];
  colors: string[];
}

export interface MixChart {
  chart: ApexChart;
  stroke: ApexStroke;
  plotOptions: ApexPlotOptions;
  series: ApexAxisChartSeries;
  fill: ApexFill;
  labels: string[];
  markers: ApexMarkers;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  tooltip: ApexTooltip;
  legend: ApexLegend;
  colors: string[];
}

export interface CandleStickChart {
  chart: ApexChart;
  plotOptions: ApexPlotOptions;
  series: ApexAxisChartSeries;
  title: ApexTitleSubtitle;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  colors: string[];
}

export interface RadarChart {
  chart: ApexChart;
  series: ApexAxisChartSeries;
  labels: string[];
  plotOptions: ApexPlotOptions;
  title: ApexTitleSubtitle;
  colors: string[];
  markers: ApexMarkers;
  tooltip: ApexTooltip;
  yaxis: ApexYAxis;
}

export interface RadialBarChart {
  chart: ApexChart;
  plotOptions: ApexPlotOptions;
  series: number[];
  labels: string[];
  colors: string[];
  responsive: ApexResponsive[];
}
