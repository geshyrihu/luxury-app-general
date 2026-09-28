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

export const totalSells: commonTopData[] = [
  {
    image: 'assets/images/dashboard-3/icon/coin1.png',
    title: 'Total Sells',
    price: '$ 12,463',
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
    price: '$ 12,463',
    color: 'danger',
    completedTo: 'Jan 2024',
    percentage: '- 20.08%',
    class: 'total-sells-2',
    arrow: 'down',
  },
];

export const ordersValue: commonTopData[] = [
  {
    title: 'Daily Orders',
    image: 'assets/images/dashboard-3/icon/sent1.png',
    price: '$ 12,463',
    color: 'success',
    completedTo: 'Jan 2024',
    percentage: '+ 20.08%',
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
