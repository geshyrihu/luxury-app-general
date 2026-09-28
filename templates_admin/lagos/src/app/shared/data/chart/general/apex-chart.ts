import {
  CommonChartOptions,
  DonutChartOptions,
  ExploringBoundariesChartOptions,
  MixedChartOptions,
  MonthlyOptions,
  OpeningOfLeafletOptions,
  OrderActivityChartOptions,
  OrderOverviewOptions,
  RadialChartOptions,
  ScheduleOptions,
  SellOverviewOptions,
  SimpleChartOptions,
  StatisticalAnalysisOptions,
  TotalRevenueChartOptions,
  TotalSalesChartOptions,
  GeneralChartOptions,
} from '../../../interface/widgets/chart';

var primary = localStorage.getItem('primary_color') || '#6f5a99';
var secondary = localStorage.getItem('secondary_color') || '#e24175';

export let openingOfLeaflet: OpeningOfLeafletOptions = {
  series: [
    {
      name: 'Growth',
      data: [22, 14, 23, 8, 14, 12, 2, 14, 18, 35, 18, 8, 24],
    },
  ],
  chart: {
    height: 150,
    type: 'line',
    stacked: true,
    toolbar: {
      show: false,
    },
    dropShadow: {
      enabled: true,
      enabledOnSeries: undefined,
      top: 5,
      left: 0,
      blur: 4,
      color: '#6f5a99',
      opacity: 0.22,
    },
  },
  grid: {
    show: true,
    borderColor: '#000000',
    strokeDashArray: 0,
    position: 'back',
    xaxis: {
      lines: {
        show: false,
      },
    },
    yaxis: {
      lines: {
        show: false,
      },
    },
  },

  colors: ['#5527FF'],
  stroke: {
    width: 3,
    curve: 'smooth',
  },

  xaxis: {
    type: 'category',
    categories: ['0', '', '10k', '', '20k', '', '30k', '', '40k', '', '50k', '', '60k', ''],
    tickAmount: 10,
    labels: {
      style: {
        fontFamily: 'Outfit, sans-serif',
        fontWeight: 500,
        colors: '#8D8D8D',
      },
    },
    axisTicks: {
      show: false,
    },
    axisBorder: {
      show: false,
    },
    tooltip: {
      enabled: false,
    },
  },
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'dark',
      gradientToColors: ['#5527FF'],
      shadeIntensity: 1,
      type: 'horizontal',
      opacityFrom: 1,
      opacityTo: 1,
    },
  },
  yaxis: {
    min: -10,
    max: 40,
    labels: {
      show: false,
    },
  },
  responsive: [
    {
      breakpoint: 575,
      options: {
        chart: {
          height: 200,
        },
      },
    },
  ],
};

export let orderOverview: OrderOverviewOptions = {
  series: [
    {
      name: 'Earning',
      type: 'area',
      data: [
        43, 43, 48, 43, 57, 50, 34, 52, 40, 40, 40, 46, 52, 40, 40, 30, 42, 37, 42, 38, 38, 38,
      ],
    },
  ],
  chart: {
    height: 330,
    type: 'line',
    stacked: false,
    toolbar: {
      show: false,
    },
    dropShadow: {
      enabled: true,
      top: 2,
      left: 0,
      blur: 4,
      color: '#000',
      opacity: 0.08,
    },
  },
  stroke: {
    width: [4, 2, 2],
    curve: 'straight',
  },
  grid: {
    show: true,
    borderColor: 'var(--chart-border)',
    strokeDashArray: 6,
  },
  plotOptions: {
    bar: {
      columnWidth: '50%',
    },
  },
  colors: ['#6f5a99', '#54BA4A', '#FF3364'],
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'light',
      type: 'vertical',
      opacityFrom: 0.4,
      opacityTo: 0,
      stops: [0, 100],
    },
  },
  annotations: {
    xaxis: [
      {
        x: 312,
        strokeDashArray: 5,
        borderWidth: 3,
        borderColor: primary,
      },
    ],
    points: [
      {
        x: 312,
        y: 52,
        marker: {
          size: 8,
          fillColor: primary,
          strokeColor: '#ffffff',
          strokeWidth: 4,
        },
        label: {
          borderWidth: 1,
          offsetY: 0,
          text: '43.10k',
          style: {
            fontSize: '14px',
            fontWeight: '600',
            fontFamily: 'Outfit, sans-serif',
          },
        },
      },
    ],
  },
  labels: [
    'Jan',
    '',
    'Feb',
    '',
    'Feb',
    '',
    'Apr',
    '',
    'Mar',
    '',
    'Jun',
    '',
    'Apr',
    '',
    'Aug',
    'Sep',
    'May',
    'Nov',
    'Aug',
    'Sep',
    'Jun',
    'Nov',
  ],
  xaxis: {
    type: 'category',
    tickAmount: 4,
    tickPlacement: 'between',
    tooltip: {
      enabled: false,
    },
    axisBorder: {
      color: 'var(--chart-border)',
    },
    axisTicks: {
      show: false,
    },
    labels: {
      style: {
        fontFamily: 'Outfit, sans-serif',
        fontWeight: 500,
        colors: '#8D8D8D',
      },
    },
  },
  legend: {
    show: false,
  },
  yaxis: {
    min: 0,
    tickAmount: 6,
    labels: {
      style: {
        fontFamily: 'Outfit, sans-serif',
        fontWeight: 500,
        colors: '#3D434A',
      },
    },
  },

  tooltip: {
    shared: false,
    intersect: false,
  },
  responsive: [
    {
      breakpoint: 1200,
      options: {
        chart: {
          height: 250,
        },
      },
    },
  ],
};

export let totalSells: GeneralChartOptions = {
  series: [
    {
      name: '',
      data: [
        30, 29.31, 29.7, 29.7, 31.32, 31.65, 31.13, 29.8, 31.79, 31.67, 32.39, 30.63, 32.89, 31.99,
        31.23, 31.57, 30.84, 31.07, 31.41, 31.17, 34, 34.5, 34.5, 32.53, 31.37, 32.43, 32.44, 30.2,
        30.14, 30.65, 30.4, 30.65, 31.43, 31.89, 31.38, 30.64, 31.02, 30.33, 32.95, 31.89, 30.01,
        30.88, 30.69, 30.58, 32.02, 32.14, 30.37, 30.51, 32.65, 32.64, 32.27, 32.1, 32.91, 30.65,
        30.8, 31.92,
      ],
    },
  ],
  chart: {
    type: 'area',
    height: 90,
    offsetY: -10,
    offsetX: 0,
    toolbar: {
      show: false,
    },
  },
  stroke: {
    width: 2,
    curve: 'smooth',
  },
  grid: {
    show: false,
    borderColor: 'var(--light)',
    padding: {
      top: 5,
      right: 0,
      bottom: -30,
      left: 0,
    },
  },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.5,
      opacityTo: 0.1,
      stops: [0, 90, 100],
    },
  },
  dataLabels: {
    enabled: false,
  },
  colors: [primary],
  xaxis: {
    labels: {
      show: false,
    },
    tooltip: {
      enabled: false,
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    opposite: false,
    min: 29,
    max: 35,
    logBase: 100,
    tickAmount: 4,
    forceNiceScale: false,
    floating: false,
    decimalsInFloat: undefined,
    labels: {
      show: false,
      offsetX: -12,
      offsetY: -15,
      rotate: 0,
    },
  },
  legend: {
    horizontalAlign: 'left',
  },
};

export let dailyOrders: GeneralChartOptions = {
  series: [
    {
      name: '',
      data: [
        30, 32.31, 31.47, 30.69, 29.32, 31.65, 31.13, 31.77, 31.79, 31.67, 32.39, 32.63, 32.89,
        31.99, 31.23, 31.57, 30.84, 31.07, 31.41, 31.17, 32.37, 32.19, 32.51, 32.53, 31.37, 30.43,
        30.44, 30.2, 30.14, 30.65, 30.4, 30.65, 31.43, 31.89, 31.38, 30.64, 30.02, 30.33, 30.95,
        31.89, 31.01, 30.88, 30.69, 30.58, 32.02, 32.14, 32.37, 32.51, 32.65, 32.64, 32.27, 32.1,
        32.91, 33.65, 33.8, 33.92,
      ],
    },
  ],
  chart: {
    type: 'area',
    height: 90,
    offsetY: -10,
    offsetX: 0,
    toolbar: {
      show: false,
    },
  },
  stroke: {
    width: 2,
    curve: 'smooth',
  },
  grid: {
    show: false,
    borderColor: 'var(--light)',
    padding: {
      top: 5,
      right: 0,
      bottom: -30,
      left: 0,
    },
  },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.5,
      opacityTo: 0.1,
      stops: [0, 80, 100],
    },
  },
  dataLabels: {
    enabled: false,
  },
  colors: [secondary],
  xaxis: {
    labels: {
      show: false,
    },
    tooltip: {
      enabled: false,
    },

    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    opposite: false,
    min: 29,
    max: 35,
    logBase: 100,
    tickAmount: 4,
    forceNiceScale: false,
    floating: false,
    decimalsInFloat: undefined,
    labels: {
      show: false,
      offsetX: -12,
      offsetY: -15,
      rotate: 0,
    },
  },
  legend: {
    horizontalAlign: 'left',
  },
};

export let ordersValue: GeneralChartOptions = {
  series: [
    {
      name: '',
      data: [
        30, 29.31, 29.7, 29.7, 31.32, 31.65, 31.13, 29.8, 31.79, 31.67, 32.39, 30.63, 32.89, 31.99,
        31.23, 31.57, 30.84, 31.07, 31.41, 31.17, 34, 34.5, 34.5, 32.53, 31.37, 32.43, 32.44, 30.2,
        30.14, 30.65, 30.4, 30.65, 31.43, 31.89, 31.38, 30.64, 31.02, 30.33, 32.95, 31.89, 30.01,
        30.88, 30.69, 30.58, 32.02, 32.14, 30.37, 30.51, 32.65, 32.64, 32.27, 32.1, 32.91, 30.65,
        30.8, 31.92,
      ],
    },
  ],
  chart: {
    type: 'area',
    height: 90,
    offsetY: -10,
    offsetX: 0,
    toolbar: {
      show: false,
    },
  },
  stroke: {
    width: 2,
    curve: 'smooth',
  },
  grid: {
    show: false,
    borderColor: 'var(--light)',
    padding: {
      top: 5,
      right: 0,
      bottom: -30,
      left: 0,
    },
  },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.5,
      opacityTo: 0.1,
      stops: [0, 90, 100],
    },
  },
  dataLabels: {
    enabled: false,
  },
  colors: ['#D77748'],
  xaxis: {
    labels: {
      show: false,
    },
    tooltip: {
      enabled: false,
    },

    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    opposite: false,
    min: 29,
    max: 35,
    logBase: 100,
    tickAmount: 4,
    forceNiceScale: false,
    floating: false,
    decimalsInFloat: undefined,
    labels: {
      show: false,
      offsetX: -12,
      offsetY: -15,
      rotate: 0,
    },
  },
  legend: {
    horizontalAlign: 'left',
  },
};

export let dailyRevenue: GeneralChartOptions = {
  series: [
    {
      name: '',
      data: [
        29, 30.31, 30.7, 31.69, 31.32, 31.65, 31.13, 31.77, 31.79, 31.67, 32.39, 32.63, 32.89,
        31.99, 31.23, 31.57, 30.84, 31.07, 31.41, 31.17, 32.37, 32.19, 32.51, 32.53, 31.37, 30.43,
        30.44, 30.2, 30.14, 30.65, 30.4, 30.65, 31.43, 31.89, 31.38, 30.64, 30.02, 30.33, 30.95,
        31.89, 31.01, 30.88, 30.69, 30.58, 32.02, 32.14, 32.37, 32.51, 32.65, 32.64, 32.27, 32.1,
        32.91, 33.65, 33.8, 33.92,
      ],
    },
  ],
  chart: {
    type: 'area',
    height: 90,
    offsetY: -10,
    offsetX: 0,
    toolbar: {
      show: false,
    },
  },
  stroke: {
    width: 2,
    curve: 'smooth',
  },
  grid: {
    show: false,
    borderColor: 'var(--light)',
    padding: {
      top: 5,
      right: 0,
      bottom: -30,
      left: 0,
    },
  },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.5,
      opacityTo: 0.1,
      stops: [0, 90, 100],
    },
  },
  dataLabels: {
    enabled: false,
  },
  colors: ['#1669A3'],
  xaxis: {
    labels: {
      show: false,
    },
    tooltip: {
      enabled: false,
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    opposite: false,
    min: 29,
    max: 35,
    logBase: 100,
    tickAmount: 4,
    forceNiceScale: false,
    floating: false,
    decimalsInFloat: undefined,
    labels: {
      show: false,
      offsetX: -12,
      offsetY: -15,
      rotate: 0,
    },
  },
  legend: {
    horizontalAlign: 'left',
  },
};

export let commonData1: CommonChartOptions = {
  series: [75],
  chart: {
    height: 105,
    type: 'radialBar',
    dropShadow: {
      enabled: true,
      top: 0,
      left: 0,
      blur: 10,
      color: primary,
      opacity: 0.35,
    },
  },
  plotOptions: {
    radialBar: {
      hollow: {
        size: '40%',
      },
      track: {
        strokeWidth: '35%',
        opacity: 1,
        margin: 5,
      },
      dataLabels: {
        value: {
          color: primary,
          fontSize: '12px',
          show: true,
          offsetY: -8,
        },
      },
    },
  },
  colors: [primary],
  stroke: {
    lineCap: 'round',
  },
  // responsive: [
  //   {
  //     breakpoint: 1500,
  //     options: {
  //       chart: {
  //         // height: 130,
  //       },
  //     },
  //   },
  // ],
};

export let commonData2: CommonChartOptions = {
  series: [50],
  chart: {
    height: 105,
    type: 'radialBar',
    dropShadow: {
      enabled: true,
      top: 0,
      left: 0,
      blur: 10,
      color: secondary,
      opacity: 0.35,
    },
  },
  plotOptions: {
    radialBar: {
      hollow: {
        size: '40%',
      },
      track: {
        strokeWidth: '35%',
        opacity: 1,
        margin: 5,
      },
      dataLabels: {
        value: {
          color: secondary,
          fontSize: '12px',
          show: true,
          offsetY: -8,
        },
      },
    },
  },
  colors: [secondary],
  stroke: {
    lineCap: 'round',
  },
  // responsive: [
  //   {
  //     breakpoint: 1500,
  //     options: {
  //       chart: {
  //         height: 130,
  //       },
  //     },
  //   },
  // ],
};

export let commonData3: CommonChartOptions = {
  series: [25],
  chart: {
    height: 105,
    type: 'radialBar',
    dropShadow: {
      enabled: true,
      top: 0,
      left: 0,
      blur: 10,
      color: 'var(--theme-default)',
      opacity: 0.35,
    },
  },
  plotOptions: {
    radialBar: {
      hollow: {
        size: '40%',
      },
      track: {
        strokeWidth: '35%',
        opacity: 1,
        margin: 5,
      },
      dataLabels: {
        value: {
          color: 'var(--chart-text-color)',
          fontSize: '12px',
          show: true,
          offsetY: -8,
        },
      },
    },
  },
  colors: ['#D77748'],
  stroke: {
    lineCap: 'round',
  },
  // responsive: [
  //   {
  //     breakpoint: 1500,
  //     options: {
  //       chart: {
  //         height: 130,
  //       },
  //     },
  //   },
  // ],
};

export let commonData4: CommonChartOptions = {
  series: [86],
  chart: {
    height: 105,
    type: 'radialBar',
    dropShadow: {
      enabled: true,
      top: 0,
      left: 0,
      blur: 10,
      color: 'var(--theme-default)',
      opacity: 0.35,
    },
  },
  plotOptions: {
    radialBar: {
      hollow: {
        size: '40%',
      },
      track: {
        strokeWidth: '35%',
        opacity: 1,
        margin: 5,
      },
      dataLabels: {
        value: {
          color: 'var(--chart-text-color)',
          fontSize: '12px',
          show: true,
          offsetY: -8,
        },
      },
    },
  },
  colors: ['#C95E9E'],
  stroke: {
    lineCap: 'round',
  },
  // responsive: [
  //   {
  //     breakpoint: 1500,
  //     options: {
  //       chart: {
  //         height: 130,
  //       },
  //     },
  //   },
  // ],
};

export let schedule: ScheduleOptions = {
  series: [
    {
      data: [
        {
          x: 'Branding',
          y: [new Date('2024-01-01').getTime(), new Date('2024-01-30').getTime()],
          fillColor: 'var(--theme-default)',
        },
        {
          x: 'Web Design',
          y: [new Date('2024-02-20').getTime(), new Date('2024-03-20').getTime()],
          fillColor: '#e24175',
        },
        {
          x: 'UX research',
          y: [new Date('2024-01-25').getTime(), new Date('2024-02-25').getTime()],
          fillColor: '#D77748',
        },
        {
          x: 'Mobile Design',
          y: [new Date('2024-01-01').getTime(), new Date('2024-02-01').getTime()],
          fillColor: '#C95E9E',
        },
        {
          x: 'NFT Website',
          y: [new Date('2024-02-20').getTime(), new Date('2024-03-20').getTime()],
          fillColor: '#0DA759',
        },
        {
          x: 'Logo Design',
          y: [new Date('2024-01-25').getTime(), new Date('2024-02-25').getTime()],
          fillColor: 'var(--theme-default)',
        },
      ],
    },
  ],
  chart: {
    height: 330,
    type: 'rangeBar',
    toolbar: {
      show: false,
    },
  },
  plotOptions: {
    bar: {
      horizontal: true,
      distributed: true,
      barHeight: '40%',
      dataLabels: {
        hideOverflowingLabels: false,
      },
    },
  },
  dataLabels: {
    enabled: true,
    formatter: function (
      _val: number,
      opts: {
        w: {
          globals: {
            labels: string[];
          };
        };
        dataPointIndex: number;
      },
    ): string {
      const label = opts.w.globals.labels[opts.dataPointIndex];
      return label;
    },
    textAnchor: 'middle',
    offsetX: 0,
    offsetY: 0,
    style: {
      fontSize: '16px',
      fontFamily: 'Outfit, sans-serif',
    },
    background: {
      enabled: true,
      padding: 6,
      borderRadius: 12,
      borderWidth: 0,
      borderColor: 'var(--white)',
      opacity: 0,
    },
  },
  xaxis: {
    type: 'datetime',
    position: 'top',
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    labels: {
      style: {
        fontFamily: 'Outfit, sans-serif',
        fontWeight: 500,
        colors: '#8D8D8D',
      },
    },
  },
  yaxis: {
    labels: {
      style: {
        fontFamily: 'Outfit, sans-serif',
        fontWeight: 500,
        colors: '#3D434A',
      },
    },

    tooltip: {
      enabled: false,
    },
  },
  grid: {
    show: false,
    row: {
      colors: ['#F4F7F9', '#fff'],
      opacity: 1,
    },
  },
  responsive: [
    {
      breakpoint: 576,
      options: {
        yaxis: {
          labels: {
            show: false,
          },
        },
        grid: {
          padding: {
            left: -10,
          },
        },
      },
    },
  ],
};

export let sellOverview: SellOverviewOptions = {
  series: [
    {
      name: 'Cash Flow',
      data: [
        -66, 50, 150, 66, 50, 150, -79, -50, -136, -54, -40, -140, 79, 49, -150, -70, 50, 140, 60,
        44, 130, -80, -40,
      ],
    },
  ],
  chart: {
    type: 'bar',
    height: 250,
    offsetX: 0,
    offsetY: 0,
    toolbar: {
      show: false,
    },
  },
  plotOptions: {
    bar: {
      colors: {
        ranges: [
          {
            from: -150,
            to: -81,
            color: primary,
          },
          {
            from: -80,
            to: -51,
            color: secondary,
          },
          {
            from: -50,
            to: 0,
            color: '#1669A3',
          },
          {
            from: 0,
            to: 50,
            color: '#1669A3',
          },
          {
            from: 51,
            to: 80,
            color: secondary,
          },
          {
            from: 81,
            to: 150,
            color: primary,
          },
        ],
      },
      columnWidth: '70%',
      borderRadius: 2,
    },
  },
  colors: [primary],
  dataLabels: {
    enabled: false,
  },
  yaxis: {
    show: true,
    title: {
      text: undefined,
    },
    labels: {
      formatter: function (y: number) {
        return y.toFixed(0) + '%';
      },
    },
  },
  grid: {
    show: true,
    strokeDashArray: 3,
    borderColor: 'rgba(106, 113, 133, 0.30)',
  },
  xaxis: {
    categories: [
      'Jan',
      '',
      'Feb',
      '',
      'Mar',
      '',
      'Apr',
      '',
      'May',
      '',
      'Jun',
      '',
      'Jul',
      '',
      'Aug',
      '',
      'Sep',
      '',
      'Oct',
      '',
      'Nov',
      '',
      'Dec',
    ],
    labels: {
      rotate: -90,
      style: {
        colors: '#9B9B9B',
      },
    },
    axisBorder: {
      offsetX: 0,
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  responsive: [
    {
      breakpoint: 1600,
      options: {
        xaxis: {
          categories: [
            'Jan',
            '',
            'Feb',
            '',
            'Mar',
            '',
            'Apr',
            '',
            'May',
            '',
            'Jun',
            '',
            'Jul',
            '',
            'Aug',
            '',
            'Sep',
          ],
        },
        series: [
          {
            data: [-66, 50, 150, 66, 50, 150, -79, -50, -136, -54, -40, -140, 79, 49, -30, 50, 30],
          },
        ],
      },
    },
    {
      breakpoint: 380,
      options: {
        yaxis: {
          labels: {
            show: false, // Hide y-axis labels for this breakpoint
          },
        },
      },
    },
  ],
};

export let statisticalAnalysis: StatisticalAnalysisOptions = {
  series: [
    {
      name: 'series1',
      data: [2.8, 3.2, 1.9, 4.5, 2.1, 3.7, 3, 3, 4.2, 1.8, 3.9, 2.6],
    },
    {
      name: 'series2',
      data: [1.2, 2, 2.7, 3, 2.5, 3, 1.6, 3.9, 2.5, 2.2, 2.4, 3.2],
    },
  ],
  chart: {
    height: 320,
    type: 'area',
    offsetY: 12,
    offsetX: -10,
    toolbar: {
      show: false,
    },
  },
  dataLabels: {
    enabled: false,
  },
  colors: [primary, secondary],
  stroke: {
    curve: 'smooth',
    width: 2,
  },
  grid: {
    show: true,
    strokeDashArray: 5,
    position: 'back',
    xaxis: {
      lines: {
        show: false,
      },
    },
  },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      inverseColors: false,
      opacityFrom: 0.45,
      opacityTo: 0.05,
      stops: [5, 100, 100, 100],
    },
  },
  annotations: {
    xaxis: [
      {
        x: 312,
        strokeDashArray: 5,
        borderWidth: 3,
        borderColor: primary,
      },
    ],
    points: [
      {
        x: 312,
        y: 4.5,
        marker: {
          size: 8,
          fillColor: primary,
          strokeColor: '#ffffff',
          strokeWidth: 4,
        },
        label: {
          borderWidth: 1,
          offsetY: 0,
          text: '5h a day on average',
          style: {
            fontSize: '14px',
            fontWeight: '600',
            fontFamily: "'Jost', sans-serif",
          },
        },
      },
    ],
  },
  yaxis: {
    labels: {
      show: true,
      style: {
        fontFamily: "'Jost', sans-serif",
        fontWeight: 500,
        colors: '#3D434A',
      },

      formatter: value => {
        return `${value}h`;
      },
    },
  },
  xaxis: {
    type: 'category',
    categories: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
    tickAmount: 12,
    labels: {
      minHeight: undefined,
      maxHeight: 28,
      offsetY: 0,
      style: {
        fontFamily: "'Jost', sans-serif",
        fontWeight: 500,
        colors: '#8D8D8D',
      },
    },
    axisBorder: {
      show: false,
    },
  },
  tooltip: {
    // custom: function ({ series, seriesIndex, dataPointIndex, w }) {
    //   return `<div class="apex-tooltip">
    //           <span>
    //                <span class="bg-secondary"> </span>
    //                 Selling : ${series[0][dataPointIndex]} K
    //           </span>
    //           <span class="mt-2">
    //                <span class="bg-primary"> </span>
    //                 Selling : ${series[1][dataPointIndex]} K
    //           </span>
    //         </div>`;
    // },
  },
  legend: {
    show: false,
  },
  responsive: [
    {
      breakpoint: 1661,
      options: {
        chart: {
          height: 290,
        },
      },
    },
    {
      breakpoint: 1200,
      options: {
        chart: {
          height: 220,
        },
      },
    },
  ],
};

export let monthlyOverview: MonthlyOptions = {
  series: [
    {
      name: 'Selling',
      data: [50, 70, 50, 65, 50, 45, 55, 60],
    },
    {
      name: 'Selling',
      data: [-60, -65, -45, -40, -50, -55, -35, -50],
    },
  ],
  chart: {
    type: 'bar',
    height: 330,
    stacked: true,
    toolbar: {
      show: false,
    },
  },
  colors: [primary, secondary],
  plotOptions: {
    bar: {
      horizontal: true,
      barHeight: '35%',
    },
  },
  dataLabels: {
    enabled: false,
  },
  legend: {
    show: false,
  },
  stroke: {
    curve: 'smooth',
  },
  grid: {
    show: true,
    borderColor: '#f0f0f0',
    xaxis: {
      lines: {
        show: true,
      },
    },
    yaxis: {
      lines: {
        show: false,
      },
    },
  },
  yaxis: {
    labels: {
      show: false,
    },
  },
  xaxis: {
    min: -99,
    max: 99,
    tickAmount: 8,
    labels: {
      formatter: (value: string) => {
        const num = Number(value);
        return isNaN(num) ? value : Math.abs(Math.round(num)) + 'k';
      },
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  responsive: [
    {
      breakpoint: 768,
      options: {
        chart: {
          height: 220,
        },
      },
    },
  ],
};

export let exploringBoundaries: ExploringBoundariesChartOptions = {
  series: [
    {
      name: 'Net Profit',
      data: [30, 70, 40, 50, 70, 50, 90, 80],
    },
    {
      name: 'Free Cash Flow',
      data: [40, 60, 35, 90, 60, 60, 60, 50],
    },
  ],
  chart: {
    type: 'bar',
    height: 280,
    offsetY: 5,
    toolbar: {
      show: false,
    },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      borderRadius: 6,
      columnWidth: '16px',
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    width: 2,
    colors: ['transparent'],
  },
  grid: {
    show: false,
    xaxis: {
      lines: {
        show: true,
      },
    },
    yaxis: {
      lines: {
        show: false,
      },
    },
  },
  yaxis: {
    show: false,
    labels: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  xaxis: {
    labels: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  states: {
    hover: {
      filter: {
        type: 'darken',
      },
    },
  },
  tooltip: {
    marker: {
      show: false,
    },
    fixed: {
      enabled: false,
      position: 'bottomRight',
      offsetX: 0,
      offsetY: 0,
    },
  },
  fill: {
    opacity: 1,
  },
  legend: {
    show: false,
  },
  colors: [secondary, primary],
  responsive: [
    {
      breakpoint: 420,
      options: {
        series: [
          {
            data: [30, 70, 40, 50, 70, 50],
          },
          {
            data: [40, 60, 35, 90, 60, 60],
          },
        ],
      },
    },
  ],
};

export let orderActivity: OrderActivityChartOptions = {
  series: [
    {
      type: 'line',
      data: [150, 470, 250, 380, 100, 480, 420],
    },
    {
      type: 'area',
      data: [300, 180, 420, 250, 320, 180, 400],
    },
  ],
  chart: {
    height: 360,
    type: 'area',
    toolbar: {
      show: false,
    },
    dropShadow: {
      enabled: true,
      left: 8,
      blur: 0,
      color: primary,
      opacity: 0.1,
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: 'smooth',
    width: [5, 0],
    colors: [primary, primary],
  },
  grid: {
    borderColor: '#3f3a591a',
  },
  fill: {
    type: 'solid',
    opacity: [1, 0.2],
  },
  tooltip: {
    marker: {
      show: false,
    },
    fixed: {
      enabled: false,
      position: 'bottomRight',
      offsetX: 0,
      offsetY: 0,
    },
    shared: true,
    intersect: false,
    y: {
      formatter: function (y: number) {
        if (typeof y !== 'undefined') {
          return y.toFixed(0) + ' k';
        }
        return y;
      },
    },
  },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'April', 'May', 'June', 'July'],
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    crosshairs: {
      show: true,
      width: 50,
      position: 'back',
      opacity: 0.2,
      stroke: {
        color: primary,
        width: 0,
        dashArray: 0,
      },
      fill: {
        type: 'solid',
        color: primary,
      },
    },
    tooltip: {
      enabled: false,
    },
  },
  legend: {
    show: false,
  },
  responsive: [
    {
      breakpoint: 575,
      options: {
        chart: {
          height: 280,
        },
      },
    },

    {
      breakpoint: 400,
      options: {
        chart: {
          height: 230,
        },
      },
    },
  ],
  colors: [primary, '#99cef1'],
};

export let codeCategory: DonutChartOptions = {
  series: [50, 30, 20],
  chart: {
    type: 'donut',
    height: 410,
  },
  plotOptions: {
    pie: {
      expandOnClick: false,
      startAngle: -90,
      endAngle: 90,
      offsetY: 10,
      donut: {
        size: '75%',
        labels: {
          show: true,
          name: {
            offsetY: -10,
          },
          value: {
            offsetY: -50,
          },
          total: {
            show: true,
            fontSize: '18px',
            fontFamily: "'Jost', sans-serif",
            fontWeight: 500,
            label: 'Product Sales',
            color: '#959595',
            formatter: () => '14,937',
          },
        },
      },
      customScale: 1,
      offsetX: 0,
    },
  },
  grid: {
    padding: {
      bottom: -120,
    },
  },
  colors: [primary, secondary, '#D77748'],
  responsive: [
    {
      breakpoint: 1601,
      options: {
        chart: {
          height: 340,
        },
      },
    },
    {
      breakpoint: 420,
      options: {
        chart: {
          height: 280,
        },
      },
    },
  ],
  legend: {
    show: false,
  },
  dataLabels: {
    enabled: false,
  },
};

export let netIncome: MixedChartOptions = {
  series: [
    {
      name: 'Total Profit',
      type: 'column',
      data: [20, 20, 40, 30, 60, 50, 35, 25, 50, 45, 55, 60, 20, 45, 20, 20],
    },
    {
      name: 'Total Profit',
      type: 'area',
      data: [50, 50, 45, 55, 50, 60, 56, 58, 50, 65, 60, 50, 60, 52, 55, 55],
    },
  ],
  chart: {
    height: 280,
    type: 'bar',
    offsetY: 15,
    toolbar: {
      show: false,
    },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '10px',
      borderRadius: 6,
    },
  },
  fill: {
    opacity: [1, 0.05],
    gradient: {
      type: 'vertical',
      opacityFrom: 0.5,
      opacityTo: 0.1,
      stops: [100, 100, 100],
    },
  },
  stroke: {
    show: false,
  },
  legend: {
    show: false,
  },
  grid: {
    show: false,
    padding: {
      top: -35,
      right: -45,
      bottom: -20,
      left: -35,
    },
  },
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    axisBorder: {
      show: false,
    },
    labels: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    labels: {
      show: false,
    },
  },
  colors: [primary],
  responsive: [
    {
      breakpoint: 1200,
      options: {
        chart: {
          height: 260,
        },
      },
    },
  ],
};

export let totalRevenue: TotalRevenueChartOptions = {
  series: [
    {
      name: 'Revenue',
      data: [92, 64, 43, 80, 58, 92, 46, 76, 80],
    },
    {
      name: 'Revenue',
      data: [20, 48, 69, 32, 54, 20, 66, 36, 32],
    },
  ],
  chart: {
    type: 'bar',
    offsetY: 30,
    toolbar: {
      show: false,
    },
    height: 100,
    stacked: true,
  },
  states: {
    hover: {
      filter: {
        type: 'darken',
      },
    },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      borderRadius: 3, // replaces startingShape/endingShape
      borderRadiusApplication: 'end', // optional: 'end' | 'all' | 'around'
      columnWidth: '55%',
    },
  },
  dataLabels: {
    enabled: false,
  },
  grid: {
    yaxis: {
      lines: {
        show: false,
      },
    },
  },
  xaxis: {
    labels: {
      show: false,
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    show: false,
  },
  fill: {
    opacity: 1,
    colors: [primary, '#dedffc'],
  },
  legend: {
    show: false,
  },
  // tooltip: {
  //   custom: function ({ series, seriesIndex, dataPointIndex,}) {
  //     return '<div class="apex-tooltip p-2">' + '<span>' + '<span class="bg-primary">' + '</span>' + 'Revenue' + '<h3>' + '$'+ series[seriesIndex][dataPointIndex] + '<h3/>'  + '</span>' + '</div>';
  //   },
  // },
  responsive: [
    {
      breakpoint: 768,
      options: {
        chart: {
          offsetY: 45,
        },
      },
    },
  ],
};

export let totalSales: TotalSalesChartOptions = {
  series: [
    {
      name: 'Sales',
      data: [15, 25, 20, 35, 16, 18, 10, 22, 18, 25, 17],
    },
  ],
  chart: {
    type: 'area',
    height: 120,
    offsetY: 50,
    zoom: {
      enabled: false,
    },
    toolbar: {
      show: false,
    },
    dropShadow: {
      enabled: true,
      top: 5,
      left: 0,
      blur: 2,
      color: secondary,
      opacity: 0.2,
    },
  },
  colors: [secondary],
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.6,
      opacityTo: 0.2,
      stops: [0, 100, 100],
    },
  },
  dataLabels: {
    enabled: false,
  },
  grid: {
    show: false,
  },
  xaxis: {
    labels: {
      show: false,
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    show: false,
  },
  stroke: {
    curve: 'smooth',
    width: 2,
  },
  // tooltip: {
  //     custom: function ({ series, seriesIndex, dataPointIndex,}) {
  //       return '<div class="apex-tooltip p-2">' + '<span>' + '<span class="bg-primary">' + '</span>' + 'Sales' + '<h3>' + '$'+ series[seriesIndex][dataPointIndex] + '<h3/>'  + '</span>' + '</div>';
  //     },
  //   },
};

export let allCustomer: SimpleChartOptions = {
  series: [
    {
      name: 'Desktops',
      data: [10, 35, 15, 78, 40, 60, 12, 60],
    },
  ],
  chart: {
    type: 'area',
    height: 120,
    offsetY: 50,
    zoom: {
      enabled: false,
    },
    toolbar: {
      show: false,
    },
    dropShadow: {
      enabled: true,
      top: 5,
      left: 0,
      blur: 2,
      color: '#1669A3',
      opacity: 0.2,
    },
  },
  colors: ['#1669A3'],
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.6,
      opacityTo: 0.2,
      stops: [0, 100, 100],
    },
  },
  dataLabels: {
    enabled: false,
  },
  grid: {
    show: false,
  },
  xaxis: {
    labels: {
      show: false,
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    show: false,
  },
  stroke: {
    curve: 'straight',
    width: 2,
  },
  // tooltip: {
  //     custom: function ({ series, seriesIndex, dataPointIndex,}) {
  //       return '<div class="apex-tooltip p-2">' + '<span>' + '<span class="bg-primary">' + '</span>' + 'customer' + '<h3>' + '$'+ series[seriesIndex][dataPointIndex] + '<h3/>'  + '</span>' + '</div>';
  //     },
  //   },
};

export let totalProduct: RadialChartOptions = {
  series: [80],
  chart: {
    type: 'radialBar',
    offsetY: 50,
    height: 180,
    sparkline: {
      enabled: false,
    },
  },
  plotOptions: {
    radialBar: {
      startAngle: -90,
      endAngle: 90,
      hollow: {
        size: '55%',
      },
      track: {
        background: '#ffebe1',
        strokeWidth: '120%',
      },
      dataLabels: {
        name: {
          show: false,
          color: 'var(--title)',
          fontSize: '17px',
        },
        value: {
          offsetY: -2,
          fontSize: '22px',
        },
      },
    },
  },
  stroke: {
    lineCap: 'round',
  },
  colors: ['#D77748'],
  responsive: [
    {
      breakpoint: 1800,
      options: {
        chart: {
          height: 160,
          offsetY: 60,
        },
      },
    },
    {
      breakpoint: 768,
      options: {
        chart: {
          offsetY: 30,
        },
      },
    },
  ],
};
