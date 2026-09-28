export interface avatar {
  title: string;
  desc: string;
  class: string;
  data: data[];
}

export interface data {
  img: string;
  imgClass: string;
  status?: string;
}

export const sizesAvtarData: avatar[] = [
  {
    title: 'Sizes',
    desc: 'You can change the size of avatar using <code>.img- * (70/80/90/100)</code> class.',
    class: 'avatar',
    data: [
      {
        img: 'assets/images/avtar/3.jpg',
        imgClass: 'img-100 rounded-circle',
      },
      {
        img: 'assets/images/avtar/4.jpg',
        imgClass: 'img-90 rounded-circle',
      },
      {
        img: 'assets/images/avtar/7.jpg',
        imgClass: 'img-80 rounded-circle',
      },
      {
        img: 'assets/images/avtar/11.jpg',
        imgClass: 'img-70 rounded-circle',
      },
    ],
  },
];

export const statusIndicatorData: avatar[] = [
  {
    title: 'Status Indicator',
    desc: 'Using <code> .status-* (online/offline/dnd)</code> class you can set the status of avatar.',
    class: 'avatar',
    data: [
      {
        img: 'assets/images/user/1.jpg',
        imgClass: 'img-100 rounded-circle',
        status: 'online',
      },
      {
        img: 'assets/images/avtar/16.jpg',
        imgClass: 'img-90 rounded-circle',
        status: 'dnd',
      },
      {
        img: 'assets/images/avtar/7.jpg',
        imgClass: 'img-80 rounded-circle',
        status: 'offline',
      },
      {
        img: 'assets/images/avtar/3.jpg',
        imgClass: 'img-70 rounded-circle',
        status: 'online',
      },
    ],
  },
];

export const shapeData: avatar[] = [
  {
    title: 'Shapes',
    desc: 'Using the<code>.b-r-* (8/30/35/25)</code> class you can set the shapes of avatar.',
    class: 'avatar',
    data: [
      {
        img: 'assets/images/avtar/4.jpg',
        imgClass: 'img-100 b-r-8',
      },
      {
        img: 'assets/images/avtar/16.jpg',
        imgClass: 'img-90 b-r-30',
      },
      {
        img: 'assets/images/avtar/3.jpg',
        imgClass: 'img-80 b-r-35',
      },
      {
        img: 'assets/images/avtar/11.jpg',
        imgClass: 'img-70 rounded-circle',
      },
    ],
  },
];

export const ratioData: avatar[] = [
  {
    title: 'Ratio',
    desc: 'Give the shape to avatar using <code>.ratio</code> and <code> img-* (50/70/80/90/100)</code> class.',
    class: 'avatar ratio',
    data: [
      {
        img: 'assets/images/avtar/11.jpg',
        imgClass: 'b-r-8 img-100',
      },
      {
        img: 'assets/images/avtar/4.jpg',
        imgClass: 'b-r-8 img-90',
      },
      {
        img: 'assets/images/user/1.jpg',
        imgClass: 'b-r-8 img-80',
      },
      {
        img: 'assets/images/avtar/16.jpg',
        imgClass: 'b-r-8 img-70',
      },
      {
        img: 'assets/images/avtar/7.jpg',
        imgClass: 'b-r-8 img-50',
      },
    ],
  },
];

export const groupingData = [
  {
    id: 1,
    data: [
      {
        img: 'assets/images/avtar/4.jpg',
        imgClass: 'img-100 b-r-8',
      },
      {
        img: 'assets/images/avtar/16.jpg',
        imgClass: 'img-80 b-r-30',
      },
      {
        img: 'assets/images/avtar/3.jpg',
        imgClass: 'img-50 b-r-35',
      },
    ],
  },
  {
    id: 2,
    data: [
      {
        img: 'assets/images/avtar/16.jpg',
        imgClass: 'img-60 rounded-circle',
      },
      {
        img: 'assets/images/user/1.jpg',
        imgClass: 'b-r-8 img-80',
      },
      {
        img: 'assets/images/avtar/16.jpg',
        imgClass: 'img-60 rounded-circle',
      },
    ],
  },
  {
    id: 3,
    data: [
      {
        img: 'assets/images/user/3.jpg',
        imgClass: 'img-40 rounded-circle',
      },
      {
        img: 'assets/images/user/5.jpg',
        imgClass: 'img-40 rounded-circle',
      },
      {
        img: 'assets/images/user/1.jpg',
        imgClass: 'img-40 rounded-circle',
      },
    ],
  },
];
