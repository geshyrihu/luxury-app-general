import {
  ApexAnnotations,
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexGrid,
  ApexLegend,
  ApexMarkers,
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexResponsive,
  ApexStates,
  ApexStroke,
  ApexTitleSubtitle,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
} from 'ng-apexcharts';

export interface SocialMediaChartOptions {
  series: ApexAxisChartSeries | number[];
  chart: ApexChart;
  plotOptions: ApexPlotOptions;
  colors: string[];
  stroke: ApexStroke;
  responsive: ApexResponsive[];

  averageTitle?: string;
  average?: string;
  parsonage?: string;
  desc?: string;
  cardColor?: string;
  name: string;
  image: string;
  pr: string;
  followers: string;
}

export interface SocialMediaInput {
  color: string[];
  dropshadowColor: string;
  radialYseries: number[];
  averageTitle?: string;
  average?: string;
  parsonage?: string;
  desc?: string;
  name: string;
  image: string;
  pr: string;
  followers: string;
}

export interface ChartWidgetOptions {
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis | ApexYAxis[];
  grid: ApexGrid;
  fill: ApexFill;
  colors: string[];
  series: ApexAxisChartSeries;
  tooltip: ApexTooltip;
  responsive: ApexResponsive[];

  // custom extra fields
  name: string;
  percentage: string;
  price1: string;
  id: string;
}

export interface ChartWidget4Options {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  plotOptions: ApexPlotOptions;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis | ApexYAxis[];
  colors: string[];
  fill: ApexFill;
  tooltip: ApexTooltip;
  responsive: ApexResponsive[];
}

export interface CircleChartOptions {
  chart: ApexChart;
  plotOptions: ApexPlotOptions;
  series: number[];
  labels: string[];
  legend: ApexLegend;
  colors: string[];
  responsive: ApexResponsive[];
}

export interface ProgressChartOptions {
  chart: ApexChart;
  plotOptions: ApexPlotOptions;
  stroke: ApexStroke;
  fill: ApexFill;
  series: ApexAxisChartSeries;
  title: ApexTitleSubtitle;
  subtitle: ApexTitleSubtitle;
  tooltip: ApexTooltip;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  responsive: ApexResponsive[];
  colors: string[];
}

export interface LiveProductChart {
  chart: ApexChart;
  stroke: ApexStroke;
  series: ApexAxisChartSeries;
  fill: ApexFill;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  colors: string[];
  labels: string[];
  markers: ApexMarkers;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis[];
  tooltip: ApexTooltip;
}

export interface TurnOverCharts {
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  xaxis: ApexXAxis;
  grid: ApexGrid;
  fill: ApexFill;
  colors: string[];
  series: ApexAxisChartSeries;
  tooltip: ApexTooltip;
}

export interface CryptoCurrencyPriceChart {
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  xaxis: ApexXAxis;
  grid: ApexGrid;
  fill: ApexFill;
  colors: string[];
  series: ApexAxisChartSeries;
  tooltip: ApexTooltip;
  responsive: ApexResponsive[];
}

export interface CryptoAnnotationChart {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  annotations: ApexAnnotations;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  grid: ApexGrid;
  title: ApexTitleSubtitle;
  colors: string[];
  labels: string[];
  xaxis: ApexXAxis;
  responsive: ApexResponsive[];
}

export interface StockMarketChart {
  series: ApexAxisChartSeries;
  plotOptions: ApexPlotOptions;
  legend: ApexLegend;
  fill: ApexFill;
  chart: ApexChart;
  stroke: ApexStroke;
  xaxis: ApexXAxis;
  grid: ApexGrid;
  responsive: ApexResponsive[];
}

export interface FinanceChart {
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  series: ApexAxisChartSeries;
  title: ApexTitleSubtitle;
  subtitle: ApexTitleSubtitle;
  fill: ApexFill;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  legend: ApexLegend;
  responsive: ApexResponsive[];
}

export interface OrderStatusChartOptions {
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  grid: ApexGrid;
  fill: ApexFill;
  colors: string[];
  markers: ApexMarkers;
  series: ApexAxisChartSeries;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  legend: ApexLegend;
  responsive: ApexResponsive[];
}

export interface MonthlySalesChartOptions {
  fill: ApexFill;
  colors: string[];
  chart: ApexChart;
  series: ApexAxisChartSeries;
  title: ApexTitleSubtitle;
  stroke: ApexStroke;
  markers: ApexMarkers;
  labels: string[];
}

export interface UsesChartOptions {
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  series: ApexAxisChartSeries;
  fill: ApexFill;
  colors: string[];
  title: ApexTitleSubtitle;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
}

export interface OpeningOfLeafletOptions {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  grid: ApexGrid;
  colors: string[];
  stroke: ApexStroke;
  xaxis: ApexXAxis;
  fill: ApexFill;
  yaxis: ApexYAxis;
  responsive: ApexResponsive[];
}

export interface OrderOverviewOptions {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  stroke: ApexStroke;
  grid: ApexGrid;
  plotOptions: ApexPlotOptions;
  colors: string[];
  fill: ApexFill;
  annotations: ApexAnnotations;
  labels: string[];
  xaxis: ApexXAxis;
  legend: ApexLegend;
  yaxis: ApexYAxis;
  tooltip: ApexTooltip;
  responsive: ApexResponsive[];
}

export interface GeneralChartOptions {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  stroke: ApexStroke;
  grid: ApexGrid;
  fill: ApexFill;
  dataLabels: ApexDataLabels;
  colors: string[];
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  legend: ApexLegend;
}

export interface CommonChartOptions {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  stroke: ApexStroke;
  plotOptions: ApexPlotOptions;
  colors: string[];
}

export interface ScheduleOptions {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  plotOptions: ApexPlotOptions;
  dataLabels: ApexDataLabels;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  grid: ApexGrid;
  responsive: ApexResponsive[];
}

export interface SellOverviewOptions {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  plotOptions: ApexPlotOptions;
  dataLabels: ApexDataLabels;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  grid: ApexGrid;
  colors: string[];
  responsive: ApexResponsive[];
}

export interface StatisticalAnalysisOptions {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  colors: string[];
  stroke: ApexStroke;
  grid: ApexGrid;
  fill: ApexFill;
  annotations: ApexAnnotations;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  tooltip: ApexTooltip;
  legend: ApexLegend;
  responsive: ApexResponsive[];
}

export interface MonthlyOptions {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  colors: string[];
  plotOptions: ApexPlotOptions;
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
  stroke: ApexStroke;
  grid: ApexGrid;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  responsive: ApexResponsive[];
}

export interface ExploringBoundariesChartOptions {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  plotOptions: ApexPlotOptions;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  grid: ApexGrid;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  states: ApexStates;
  tooltip: ApexTooltip;
  fill: ApexFill;
  legend: ApexLegend;
  colors: string[];
  responsive: ApexResponsive[];
}

export interface OrderActivityChartOptions {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  grid: ApexGrid;
  fill: ApexFill;
  tooltip: ApexTooltip;
  xaxis: ApexXAxis;
  legend: ApexLegend;
  responsive: ApexResponsive[];
  colors: string[];
}

export interface DonutChartOptions {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  plotOptions: ApexPlotOptions;
  grid: ApexGrid;
  colors: string[];
  responsive: ApexResponsive[];
  legend: ApexLegend;
  dataLabels: ApexDataLabels;
}

export interface MixedChartOptions {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  plotOptions: ApexPlotOptions;
  stroke: ApexStroke;
  fill: ApexFill;
  grid: ApexGrid;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  colors: string[];
  dataLabels: ApexDataLabels;
  responsive: ApexResponsive[];
  legend: ApexLegend;
}

export interface VisitorsChart {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  stroke: ApexStroke;
  grid: ApexGrid;
  colors: string[];
  fill: ApexFill;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  legend: ApexLegend;
  responsive: ApexResponsive[];
}

export interface TotalRevenueChartOptions {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  states: ApexStates;
  legend: ApexLegend;
  responsive: ApexResponsive[];
}

export interface TotalSalesChartOptions {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  stroke: ApexStroke;
  fill: ApexFill;
  grid: ApexGrid;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  dataLabels: ApexDataLabels;
  colors: string[];
}

export interface SimpleChartOptions {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  stroke: ApexStroke;
  fill: ApexFill;
  grid: ApexGrid;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis | ApexYAxis[];
  dataLabels: ApexDataLabels;
  colors: string[];
}

export interface RadialChartOptions {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  plotOptions: ApexPlotOptions;
  stroke: ApexStroke;
  colors: string[];
  responsive?: ApexResponsive[];
}

export interface TopChartItem {
  icon: string;
  title: string;
  subTitle: string;
  chipIcon: string;
  profitClass?: string;
  profit?: string;
  class?: string;
  chartClass: string;
  chartId: string;
  chartData: {
    series: ApexAxisChartSeries | ApexNonAxisChartSeries;
    chart: ApexChart;
    stroke?: ApexStroke;
    fill?: ApexFill;
    grid?: ApexGrid;
    xaxis?: ApexXAxis;
    yaxis?: ApexYAxis | ApexYAxis[];
    dataLabels?: ApexDataLabels;
    legend?: ApexLegend;
    responsive?: ApexResponsive[];
    states?: ApexStates;
    plotOptions?: ApexPlotOptions;
    colors?: string[];
  };
}
