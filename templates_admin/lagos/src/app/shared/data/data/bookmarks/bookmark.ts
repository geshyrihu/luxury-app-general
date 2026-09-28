export interface bookMark {
  title_id: number;
  active: boolean;
  title: string;
  data: datas[];
}

export interface datas {
  id: number;
  img: string;
  url: string;
  title: string;
  desc: string;
  collection: string;
  favorite: boolean;
}

export interface bookmarkModel {
  collection: string;
  desc: string;
  favorite: boolean;
  id: number;
  img: string;
  title: string;
  url: string;
}

export const ViewsData: bookMark[] = [
  {
    title_id: 1,
    active: true,
    title: 'Created By Me',
    data: [
      {
        id: 1,
        img: 'assets/images/lightgallry/01.jpg',
        url: 'http://admin.pixelstrap.com//ltr/landing-page.html',
        title: 'Admin Template',
        desc: 'is beautifully crafted, clean and modern designed admin theme with 6 different demos and light - dark versions.',
        collection: 'General',
        favorite: false,
      },
      {
        id: 2,
        img: 'assets/images/lightgallry/02.jpg',
        url: 'https://angular.pixelstrap.com/universal/landing',
        title: 'Universal Template',
        desc: 'Universal is beautifully crafted, clean and modern designed admin theme',
        collection: 'General',
        favorite: false,
      },
      {
        id: 3,
        img: 'assets/images/lightgallry/03.jpg',
        url: 'https://angular.pixelstrap.com/lagos/landing',
        title: 'Angular Theme',
        desc: 'Lagos is beautifully crafted, clean and modern designed admin theme',
        collection: 'Fs',
        favorite: false,
      },
      {
        id: 4,
        img: 'assets/images/lightgallry/04.jpg',
        url: 'http://themes.pixelstrap.com/multikart/back-end/index.html',
        title: 'Multikart Admin',
        desc: 'Multikart Admin is modern designed admin theme',
        collection: 'General',
        favorite: false,
      },
      {
        id: 5,
        img: 'assets/images/lightgallry/05.jpg',
        url: 'http://themes.pixelstrap.com/multikart',
        title: 'Ecommerece theme',
        desc: 'Multikart HTML template is an apparently simple but highly functional tempalate designed for creating a flourisahing online business.',
        collection: 'General',
        favorite: false,
      },
      {
        id: 6,
        img: 'assets/images/lightgallry/06.jpg',
        url: 'http://vue.pixelstrap.com/tovo/home-one',
        title: 'Tovo app landing page',
        desc: 'Amazing Landing Page With Easy Customization',
        collection: 'Fs',
        favorite: false,
      },
    ],
  },
  {
    title_id: 2,
    active: false,
    title: 'favorites',
    data: [],
  },
  {
    title_id: 3,
    active: false,
    title: 'Shared With Me',
    data: [],
  },
  {
    title_id: 4,
    active: false,
    title: 'My Bookmark',
    data: [
      {
        id: 1,
        img: 'assets/images/lightgallry/07.jpg',
        url: 'http://admin.pixelstrap.com/lagos/ltr/landing-page.html',
        title: 'Admin Template',
        desc: 'Lagos is beautifully crafted, clean and modern designed admin theme with 6 different demos and light - dark versions.',
        collection: 'General',
        favorite: false,
      },
      {
        id: 2,
        img: 'assets/images/lightgallry/07.jpg',
        url: 'https://angular.pixelstrap.com/universal/landing',
        title: 'Universal Template',
        desc: 'Universal is beautifully crafted, clean and modern designed admin theme',
        collection: 'General',
        favorite: false,
      },
      {
        id: 3,
        img: 'assets/images/lightgallry/07.jpg',
        url: 'https://angular.pixelstrap.com/lagos/landing',
        title: 'Angular Theme',
        desc: 'Lagos is beautifully crafted, clean and modern designed admin theme ',
        collection: 'Fs',
        favorite: false,
      },
      {
        id: 4,
        img: 'assets/images/lightgallry/07.jpg',
        desc: 'Multikart Admin is modern designed admin theme',
        url: 'http://themes.pixelstrap.com/multikart/back-end/index.html',
        title: 'Multikart Admin',
        collection: 'General',
        favorite: false,
      },
      {
        id: 5,
        img: 'assets/images/lightgallry/07.jpg',
        url: 'http://themes.pixelstrap.com/multikart',
        desc: 'Multikart HTML template is an apparently simple but highly functional tempalate designed for creating a flourisahing online business.',
        title: 'Ecommerece theme',
        collection: 'General',
        favorite: false,
      },
      {
        id: 6,
        img: 'assets/images/lightgallry/07.jpg',
        url: 'http://vue.pixelstrap.com/tovo/home-one',
        desc: 'Amazing Landing Page With Easy Customization.',
        title: 'Tovo app landing page',
        collection: 'Fs',
        favorite: false,
      },
    ],
  },
];

export const tagsData: bookMark[] = [
  {
    title_id: 5,
    active: false,
    title: 'Notification',
    data: [],
  },
  {
    title_id: 6,
    active: false,
    title: 'Newsletter',
    data: [],
  },
  {
    title_id: 7,
    active: false,
    title: 'Business',
    data: [],
  },
  {
    title_id: 8,
    active: false,
    title: 'Holidays',
    data: [],
  },
  {
    title_id: 9,
    active: false,
    title: 'Important',
    data: [],
  },
  {
    title_id: 10,
    active: false,
    title: 'Organization',
    data: [],
  },
];
