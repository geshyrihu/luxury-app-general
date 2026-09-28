import { TopChartItem } from '../../../interface/widgets/chart';
import {
  allCustomer,
  totalProduct,
  totalRevenue,
  totalSales,
} from '../../chart/general/apex-chart';

export interface commonTopData {
  title: string;
  price: string;
  color: string;
  completedTo: string;
  image: string;
  percentage: string;
  class: string;
  arrow: string;
}

export interface productTrending {
  image: string;
  title: string;
  price: string;
  discount: string;
  rating: number;
  label?: string;
  class?: string;
}

export const totalSells: commonTopData[] = [
  {
    image: 'assets/images/dashboard-3/icon/coin1.png',
    title: 'Total Sells',
    price: '12,463',
    color: 'success',
    completedTo: 'Jan 2024',
    percentage: '+ 20.08%',
    class: 'total-sells',
    arrow: 'up',
  },
];

export const dailyOrders: commonTopData[] = [
  {
    image: 'assets/images/dashboard-3/icon/shopping1.png',
    title: 'Orders Value',
    price: '78,596',
    color: 'danger',
    completedTo: 'Aug 2024',
    percentage: '- 10.02%',
    class: 'total-sells-2',
    arrow: 'down',
  },
];

export const ordersValue: commonTopData[] = [
  {
    title: 'Daily Orders',
    image: 'assets/images/dashboard-3/icon/sent1.png',
    price: '95,789',
    color: 'success',
    completedTo: 'May 2024',
    percentage: '+ 13.23%',
    class: 'total-sells-3',
    arrow: 'up',
  },
];

export const dailyRevenue: commonTopData[] = [
  {
    image: 'assets/images/dashboard-3/icon/revenue1.png',
    title: 'Daily Revenue',
    price: '$ 12,463',
    color: 'danger',
    completedTo: 'Jan 2024',
    percentage: '- 20.08%',
    class: 'total-sells-4',
    arrow: 'down',
  },
];

export const recentCustomers = [
  {
    id: 1,
    image: 'assets/images/dashboard-3/user/1.png',
    title: 'Junsung Park',
    uid: '#32449',
    status: 'Paid',
    price: '8282.13',
    time: '50',
  },
  {
    id: 2,
    image: 'assets/images/dashboard-3/user/2.png',
    title: 'Yongjae Choi',
    uid: '#95460',
    status: 'Pending',
    price: '9546.84',
    time: '34',
  },
  {
    id: 3,
    image: 'assets/images/dashboard-3/user/3.png',
    title: 'Seonil Jang',
    uid: '#95468',
    status: 'Paid',
    price: '2354.16',
    time: '30',
  },
  {
    id: 4,
    image: 'assets/images/dashboard-3/user/4.png',
    title: 'Joohee Min',
    uid: '#95462',
    status: 'Pending',
    price: '3254.35',
    time: '25',
  },
  {
    id: 5,
    image: 'assets/images/dashboard-3/user/5.png',
    title: 'Soojung Kin',
    uid: '#34586',
    status: 'Paid',
    price: '3654.32',
    time: '23',
  },
];

export const recentOrders = [
  {
    order: [
      {
        image: 'assets/images/dashboard-3/1.png',
        title: 'Decorative Plants',
      },
    ],
    orderDate: '20 Sep',
    orderTime: '03.00AM',
    oty: 12,
    customer: [
      {
        image: 'assets/images/dashboard-3/user/6.png',
        name: 'Leonie Green',
      },
    ],
    price: '637.30',
    status: 'Succeed',
    class: 'success',
  },
  {
    order: [
      {
        image: 'assets/images/dashboard-3/2.png',
        title: 'Sticky Calender',
      },
    ],
    orderDate: '12 Mar',
    orderTime: '08.12AM',
    oty: 14,
    customer: [
      {
        image: 'assets/images/dashboard-3/user/8.png',
        name: 'Peter White',
      },
    ],
    price: '637.30',
    status: 'Warning',
    class: 'warning',
  },
  {
    order: [
      {
        image: 'assets/images/dashboard-3/3.png',
        title: 'Crystal Mug',
      },
    ],
    orderDate: 'Feb 15',
    orderTime: '10.00AM',
    oty: 19,
    customer: [
      {
        image: 'assets/images/dashboard-3/user/7.png',
        name: 'Ruby Yang',
      },
    ],
    price: '637.30',
    status: 'Succeed',
    class: 'success',
  },
  {
    order: [
      {
        image: 'assets/images/dashboard-3/4.png',
        title: 'Motion Table Lamp',
      },
    ],
    orderDate: 'Jun 10',
    orderTime: '12.30AM',
    oty: 17,
    customer: [
      {
        image: 'assets/images/dashboard-3/user/8.png',
        name: 'Visha Long',
      },
    ],
    price: '637.30',
    status: 'Canceled',
    class: 'danger',
  },
  // {
  //   order: [
  //     {
  //       image: "assets/images/dashboard-3/2.png",
  //       title: "Sticky Calender",
  //     },
  //   ],
  //   orderDate: "12 Mar",
  //   orderTime: "08.12AM",
  //   oty: 14,
  //   customer: [
  //     {
  //       image: "assets/images/dashboard-3/user/8.png",
  //       name: "Peter White",
  //     },
  //   ],
  //   price: "637.30",
  //   status: "Warning",
  //   class: "warning",
  // },
  // {
  //   order: [
  //     {
  //       image: "assets/images/dashboard-3/3.png",
  //       title: "Crystal Mug",
  //     },
  //   ],
  //   orderDate: "Feb 15",
  //   orderTime: "10.00AM",
  //   oty: 19,
  //   customer: [
  //     {
  //       image: "assets/images/dashboard-3/user/7.png",
  //       name: "Ruby Yang",
  //     },
  //   ],
  //   price: "637.30",
  //   status: "Succeed",
  //   class: "success",
  // },
  // {
  //   order: [
  //     {
  //       image: "assets/images/dashboard-3/4.png",
  //       title: "Motion Table Lamp",
  //     },
  //   ],
  //   orderDate: "Jun 10",
  //   orderTime: "12.30AM",
  //   oty: 17,
  //   customer: [
  //     {
  //       image: "assets/images/dashboard-3/user/8.png",
  //       name: "Visha Long",
  //     },
  //   ],
  //   price: "637.30",
  //   status: "Canceled",
  //   class: "danger",
  // },
];

export const contriesSale = [
  {
    icon: 'map-loaction',
    countery: 'United States',
    percentage: '53.23',
    class: 'fill-primary',
  },
  {
    icon: 'map-loaction',
    countery: 'Romania',
    percentage: '31.85',
    class: 'fill-secondary',
  },
  {
    icon: 'map-loaction',
    countery: 'Austalia',
    percentage: '12.98',
    class: 'fill-warning',
  },
  {
    icon: 'map-loaction',
    countery: 'Germany',
    percentage: '45.23',
    class: 'fill-tertiary',
  },
  {
    icon: 'map-loaction',
    countery: 'Africa',
    percentage: '23.15',
    class: 'fill-success',
  },
  {
    icon: 'map-loaction',
    countery: 'Europe',
    percentage: '95.75',
    class: 'fill-danger',
  },
];

export const itemsProgress = [
  {
    class: 'primary',
    width: '25%',
  },
  {
    class: 'secondary',
    width: '25%',
  },
  {
    class: 'warning',
    width: '25%',
  },
  {
    class: 'tertiary',
    width: '25%',
  },
];

export const TopSeller = [
  {
    image: 'assets/images/dashboard-3/user/9.png',
    name: 'Gary Waters',
    brandName: 'Adidas',
    product: 'Clothes',
    sold: 650,
    price: 37.5,
    earnings: 24375,
  },
  {
    image: 'assets/images/dashboard-3/user/10.png',
    name: 'Edwin Hogan',
    brandName: 'Nike',
    product: 'Shoes',
    sold: 956,
    price: 24.75,
    earnings: 23661,
  },
  {
    image: 'assets/images/dashboard-3/user/11.png',
    name: 'Aaron Hogan',
    brandName: 'Sony',
    product: 'Electronics',
    sold: 348,
    price: 184.5,
    earnings: 64206,
  },
  {
    image: 'assets/images/dashboard-3/user/12.png',
    name: 'Ralph Waters',
    brandName: 'i Phone',
    product: 'Mobile',
    sold: 100,
    price: 150.25,
    earnings: 15025,
  },
];

export const grossSales = [
  {
    image: 'assets/images/dashboard-2/dash-2/01.png',
    name: 'Anna Catmire',
    year: '2024 ',
    flag: 'gb',
    total: '$56,764',
    status: 'Success',
    date: '10 August',
    product: 'Watch',
  },
  {
    image: 'assets/images/dashboard-2/dash-2/02.png',
    name: 'Laura Dason',
    year: '2024 ',
    flag: 'us',
    total: '$56,845',
    status: 'Success',
    date: '15 Sept',
    product: 'Electronics',
  },
  {
    image: 'assets/images/dashboard-2/dash-2/03.png',
    name: 'Rachel Gree',
    year: '2024 ',
    flag: 'gb',
    total: '$56,764',
    status: 'Success',
    date: '10 March',
    product: 'Shoes',
  },
  {
    image: 'assets/images/dashboard-2/dash-2/04.png',
    name: 'Polly Meery',
    year: '2024 ',
    flag: 'at',
    total: '$56,764',
    status: 'Success',
    date: '25 May',
    product: 'Clothes',
  },
];

export const trendingProduct: productTrending[] = [
  {
    image: 'assets/images/dashboard-2/product/6.png',
    title: "Men's Green Jacket",
    price: '24.00',
    discount: '30.00',
    rating: 4,
    label: 'Hot',
    class: 'primary',
  },
  {
    image: 'assets/images/dashboard-2/product/5.png',
    title: 'Full Sleeve Women Top',
    price: '20.00',
    discount: '25.00',
    rating: 4.5,
  },
  {
    image: 'assets/images/dashboard-2/product/4.png',
    title: "Women's Yellow top",
    price: '25.00',
    discount: '35.00',
    rating: 5,
    label: '50%',
    class: 'secondary',
  },
];

export const openInvoices = [
  {
    invoice: 'FV 00012/05/2024',
    image: 'assets/images/dashboard-2/user/16.png',
    customer: 'Walter Reuter',
    email: 'walter.reuter@gmail.com',
    button: 'Paid',
    class: 'primary',
    amount: '5,654.00',
  },
  {
    invoice: 'FV 00009/10/2024',
    image: 'assets/images/dashboard-2/user/17.png',
    customer: 'Selena Waner',
    email: 'selena.waner@gmail.com',
    button: 'Overdue',
    class: 'secondary',
    amount: '2,942.00',
  },
  {
    invoice: 'FV 00025/04/2024',
    image: 'assets/images/dashboard-2/user/18.png',
    customer: 'Fran Loain',
    email: 'fran.loain@gmail.com',
    button: 'Unpaid',
    class: 'warning',
    amount: '3,753.00',
  },
  {
    invoice: 'FV 00002/11/2024',
    image: 'assets/images/dashboard-2/user/19.png',
    customer: 'Wilson Smith',
    email: 'wilson.smith@gmail.com',
    button: 'Paid',
    class: 'info',
    amount: '5,365.00',
  },
];

export const topChart: TopChartItem[] = [
  {
    icon: 'Revenue',
    title: '$25,456',
    subTitle: 'Total Revenue',
    chipIcon: 'arrow-chart-up',
    profitClass: 'success',
    class: '',
    profit: '+45%',
    chartClass: 'earning-chart',
    chartId: 'earning-chart',
    chartData: totalRevenue,
  },
  {
    icon: 'Sales',
    title: '20k USD',
    subTitle: 'Total Sales ',
    chipIcon: 'arrow-chart',
    profitClass: 'danger',
    profit: '-10%',
    class: 'up-sales',
    chartClass: 'sales-chart',
    chartId: 'sales-chart',
    chartData: totalSales,
  },
  {
    icon: 'Customer',
    title: '50,863',
    subTitle: 'All Customer ',
    chipIcon: 'arrow-chart',
    profitClass: 'danger',
    class: 'total-customer',
    chartClass: 'customer-chart',
    chartId: 'total-customer-chart',
    profit: '-15%',
    chartData: allCustomer,
  },
  {
    icon: 'Product',
    title: '56,491',
    subTitle: 'Total Product',
    chipIcon: 'arrow-chart-up',
    class: 'total-product',
    profitClass: 'success',
    chartClass: 'total-product-chart',
    chartId: 'total-product-chart',
    profit: '+30%',
    chartData: totalProduct,
  },
];
