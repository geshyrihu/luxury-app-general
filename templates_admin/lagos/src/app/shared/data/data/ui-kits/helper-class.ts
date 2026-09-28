export interface commonHelperClasses {
  header: string;
  desc: string;
  titleData: titleData[];
}

export interface titleData {
  title: string;
  colClass: string;
  divClass: string;
  data: data[];
}

export interface data {
  text: string;
  textClass: string;
  textC?: string;
}

export interface images {
  img: string;
  imgClass: string;
  alt: string;
}

export interface commanSide {
  header: string;
  desc: string;
  title: TitleData[];
}

export interface TitleData {
  title: string;
  colClass: string;
  item: Data[];
}

export interface Data {
  text: string;
}

export const StyleBorderData: commonHelperClasses[] = [
  {
    header: 'Styles In Borders',
    desc: 'Use The Different Styles Of Borders Like: <code>Border Radius/Border-Color/Border-Width</code>. Use Of Any Components.',
    titleData: [
      {
        title: 'Custom border-radius class',
        colClass: 'col-xxl-3 col-sm-6',
        divClass: 'border-wrapper h-100 alert-light-light dark-helper',
        data: [
          {
            text: '.b-r-0',
            textClass: 'helper-box b-r-0 bg-light border',
          },
          {
            text: '.b-r-1',
            textClass: 'helper-box b-r-1 bg-light border',
          },
          {
            text: '.b-r-2',
            textClass: 'helper-box b-r-2 bg-light border',
          },
          {
            text: '.b-r-3',
            textClass: 'helper-box b-r-3 bg-light border',
          },
          {
            text: '.b-r-4',
            textClass: 'helper-box b-r-4 bg-light border',
          },
          {
            text: '.b-r-5',
            textClass: 'helper-box b-r-5 bg-light border',
          },
          {
            text: '.b-r-6',
            textClass: 'helper-box b-r-6 bg-light border',
          },
          {
            text: '.b-r-7',
            textClass: 'helper-box b-r-7 bg-light border',
          },
          {
            text: '.b-r-8',
            textClass: 'helper-box b-r-8 bg-light border',
          },
          {
            text: '.b-r-9',
            textClass: 'helper-box b-r-9 bg-light border',
          },
          {
            text: '.b-r-10',
            textClass: 'helper-box b-r-10 bg-light border',
          },
        ],
      },
      {
        title: 'Border color',
        colClass: 'col-xxl-3 col-sm-6',
        divClass: 'border-wrapper h-100 alert-light-light dark-helper',
        data: [
          {
            text: '.border-primary',
            textClass: 'helper-box border-primary border',
          },
          {
            text: '.border-secondary',
            textClass: 'helper-box border-secondary border',
          },
          {
            text: '.border-success',
            textClass: 'helper-box border-success border',
          },
          {
            text: '.border-danger',
            textClass: 'helper-box border-danger border',
          },
          {
            text: '.border-warning',
            textClass: 'helper-box border-warning border',
          },
          {
            text: '.border-info',
            textClass: 'helper-box border-info border',
          },
          {
            text: '.border-dark',
            textClass: 'helper-box border-dark border',
          },
        ],
      },
      {
        title: 'Border-width',
        colClass: 'col-xxl-3 col-sm-6',
        divClass: 'border-wrapper h-100 alert-light-light dark-helper',
        data: [
          {
            text: '.border-1',
            textClass: 'helper-box border-1 border',
          },
          {
            text: '.border-2',
            textClass: 'helper-box border-2 border',
          },
          {
            text: '.border-3',
            textClass: 'helper-box border-3 border',
          },
          {
            text: '.border-4',
            textClass: 'helper-box border-4 border',
          },
          {
            text: '.border-5',
            textClass: 'helper-box border-5 border',
          },
          {
            text: '.border-6',
            textClass: 'helper-box border-6 border',
          },
          {
            text: '.border-7',
            textClass: 'helper-box border-7 border',
          },
          {
            text: '.border-8',
            textClass: 'helper-box border-8 border',
          },
          {
            text: '.border-9',
            textClass: 'helper-box border-9 border',
          },
          {
            text: '.border-10',
            textClass: 'helper-box border-10 border',
          },
        ],
      },
      {
        title: 'Text colors',
        colClass: 'col-xxl-3 col-sm-6',
        divClass: 'border-wrapper alert-light-light h-100 dark-helper',
        data: [
          {
            text: '.txt-primary',
            textClass: 'helper-box helper-text border txt-primary',
            textC: 'c',
          },
          {
            text: '.txt-secondary',
            textClass: 'helper-box helper-text border txt-secondary',
            textC: 'c',
          },
          {
            text: '.txt-success',
            textClass: 'helper-box helper-text border txt-success',
            textC: 'c',
          },
          {
            text: '.txt-danger',
            textClass: 'helper-box helper-text border txt-danger',
            textC: 'c',
          },
          {
            text: '.txt-warning',
            textClass: 'helper-box helper-text border txt-warning',
            textC: 'c',
          },
          {
            text: '.txt-info',
            textClass: 'helper-box helper-text border txt-info',
            textC: 'c',
          },
          {
            text: '.txt-dark',
            textClass: 'helper-box helper-text border txt-dark',
            textC: 'c',
          },
          {
            text: '.txt-light',
            textClass: 'helper-box helper-text border txt-light bg-dark',
            textC: 'c',
          },
        ],
      },
    ],
  },
];

export const BorderAndDisplayData: commonHelperClasses[] = [
  {
    header: 'Borders And Displays',
    desc: "Use border utilities to add or remove an element's borders.",
    titleData: [
      {
        title: 'Additive border',
        colClass: 'col-xl-4 col-sm-6',
        divClass: 'border-wrapper h-100 border',
        data: [
          {
            text: '.border',
            textClass: 'helper-box bg-light border',
          },
          {
            text: '.border-top',
            textClass: 'helper-box bg-light border-top',
          },
          {
            text: '.border-bottom',
            textClass: 'helper-box bg-light border-bottom',
          },
          {
            text: '.border-start',
            textClass: 'helper-box bg-light border-start',
          },
          {
            text: '.border-end',
            textClass: 'helper-box bg-light border-end',
          },
        ],
      },
      {
        title: 'Subtractive border',
        colClass: 'col-xl-4 col-sm-6',
        divClass: 'border-wrapper h-100 border',
        data: [
          {
            text: '.border-0',
            textClass: 'helper-box bg-light border border-0',
          },
          {
            text: '.border-top-0',
            textClass: 'helper-box bg-light border border-top-0',
          },
          {
            text: '.border-end-0',
            textClass: 'helper-box bg-light border border-end-0',
          },
          {
            text: '.border-bottom-0',
            textClass: 'helper-box bg-light border border-bottom-0',
          },
          {
            text: '.border-start-0',
            textClass: 'helper-box bg-light border border-start-0',
          },
        ],
      },
      {
        title: 'Additive radius',
        colClass: 'col-xl-4 col-sm-12',
        divClass: 'border-wrapper h-100 border',
        data: [
          {
            text: '.rounded',
            textClass: 'helper-radius radius-wrapper rounded',
          },
          {
            text: '.rounded-top',
            textClass: 'helper-radius radius-wrapper rounded-top',
          },
          {
            text: '.rounded-end',
            textClass: 'helper-radius radius-wrapper rounded-end',
          },
          {
            text: '.rounded-bottom',
            textClass: 'helper-radius radius-wrapper rounded-bottom',
          },
          {
            text: '.rounded-start',
            textClass: 'helper-radius radius-wrapper rounded-start',
          },
          {
            text: '.rounded-pill',
            textClass: 'helper-radius radius-wrapper rounded-pill',
          },
          {
            text: '.rounded-circle',
            textClass: 'helper-radius radius-wrapper rounded-circle',
          },
          {
            text: '.rounded-0',
            textClass: 'helper-radius radius-wrapper rounded-0',
          },
        ],
      },
    ],
  },
];

export const backgroundColorsData: commonHelperClasses[] = [
  {
    header: 'Background Colors',
    desc: 'Use The <code>.Bg-*</code> And .<code>Alert-Light-* </code> Colors In Lagos Theme. Use Of Any Components.',
    titleData: [
      {
        title: 'Dark background',
        colClass: 'col-xl-4 col-sm-6',
        divClass: 'border-wrapper h-100 border',
        data: [
          {
            text: '.bg-primary',
            textClass: 'helper-box bg-primary',
          },
          {
            text: '.bg-secondary',
            textClass: 'helper-box bg-secondary',
          },
          {
            text: '.bg-success',
            textClass: 'helper-box bg-success',
          },
          {
            text: '.bg-danger',
            textClass: 'helper-box bg-danger',
          },
          {
            text: '.bg-warning',
            textClass: 'helper-box bg-warning',
          },
          {
            text: '.bg-info',
            textClass: 'helper-box bg-info',
          },
          {
            text: '.bg-dark',
            textClass: 'helper-box bg-dark',
          },
          {
            text: '.bg-light',
            textClass: 'helper-box bg-light',
          },
        ],
      },
      {
        title: 'Light backgrounds',
        colClass: 'col-xl-4 col-sm-6',
        divClass: 'border-wrapper h-100 border',
        data: [
          {
            text: '.alert-light-primary',
            textClass: 'helper-box alert-light-primary',
          },
          {
            text: '.alert-light-secondary',
            textClass: 'helper-box alert-light-secondary',
          },
          {
            text: '.alert-light-success',
            textClass: 'helper-box alert-light-success',
          },
          {
            text: '.alert-light-danger',
            textClass: 'helper-box alert-light-danger',
          },
          {
            text: '.alert-light-warning',
            textClass: 'helper-box alert-light-warning',
          },
          {
            text: '.alert-light-info',
            textClass: 'helper-box alert-light-info',
          },
          {
            text: '.alert-light-dark',
            textClass: 'helper-box alert-light-dark',
          },
          {
            text: '.alert-light-light',
            textClass: 'helper-box alert-light-light',
          },
        ],
      },
      {
        title: 'Extended background colors',
        colClass: 'col-xl-4 col-sm-12',
        divClass: 'border-wrapper h-100 border',
        data: [
          {
            text: '.light-card',
            textClass: 'helper-box light-card',
          },
          {
            text: '.light-background',
            textClass: 'helper-box light-background border',
          },
        ],
      },
    ],
  },
];

export const borderColor: data[] = [
  {
    text: '.b-primary',
    textClass: 'primary',
  },
  {
    text: '.b-t-primary',
    textClass: 't-primary',
  },
  {
    text: '.b-b-primary',
    textClass: 'b-primary',
  },
  {
    text: '.b-l-primary',
    textClass: 'l-primary',
  },
  {
    text: '.b-r-primary',
    textClass: 'r-primary',
  },
  {
    text: '.b-secondary',
    textClass: 'secondary',
  },
  {
    text: '.b-t-secondary',
    textClass: 't-secondary',
  },
  {
    text: '.b-b-secondary',
    textClass: 'b-secondary',
  },
  {
    text: '.b-l-secondary',
    textClass: 'l-secondary',
  },
  {
    text: '.b-r-secondary',
    textClass: 'r-secondary',
  },
  {
    text: '.b-success',
    textClass: 'success',
  },
  {
    text: '.b-t-success',
    textClass: 't-success',
  },
  {
    text: '.b-b-success',
    textClass: 'b-success',
  },
  {
    text: '.b-l-success',
    textClass: 'l-success',
  },
  {
    text: '.b-r-success',
    textClass: 'r-success',
  },
  {
    text: '.b-danger',
    textClass: 'danger',
  },
  {
    text: '.b-t-danger',
    textClass: 't-danger',
  },
  {
    text: '.b-b-danger',
    textClass: 'b-danger',
  },
  {
    text: '.b-l-danger',
    textClass: 'l-danger',
  },
  {
    text: '.b-r-danger',
    textClass: 'r-danger',
  },
  {
    text: '.b-warning',
    textClass: 'warning',
  },
  {
    text: '.b-t-warning',
    textClass: 't-warning',
  },
  {
    text: '.b-b-warning',
    textClass: 'b-warning',
  },
  {
    text: '.b-l-warning',
    textClass: 'l-warning',
  },
  {
    text: '.b-r-warning',
    textClass: 'r-warning',
  },
  {
    text: '.b-info',
    textClass: 'info',
  },
  {
    text: '.b-t-info',
    textClass: 't-info',
  },
  {
    text: '.b-b-info',
    textClass: 'b-info',
  },
  {
    text: '.b-l-info',
    textClass: 'l-info',
  },
  {
    text: '.b-r-info',
    textClass: 'r-info',
  },
  {
    text: '.b-dark',
    textClass: 'dark',
  },
  {
    text: '.b-t-dark',
    textClass: 't-dark',
  },
  {
    text: '.b-b-dark',
    textClass: 'b-dark',
  },
  {
    text: '.b-l-dark',
    textClass: 'l-dark',
  },
  {
    text: '.b-r-dark',
    textClass: 'r-dark',
  },
  {
    text: '.b-light',
    textClass: 'light',
  },
  {
    text: '.b-t-light',
    textClass: 't-light',
  },
  {
    text: '.b-b-light',
    textClass: 'b-light',
  },
  {
    text: '.b-l-light',
    textClass: 'l-light',
  },
  {
    text: '.b-r-light',
    textClass: 'r-light',
  },
];

export const imageSizeData: images[] = [
  {
    imgClass: 'img-30 img-h-30',
    img: 'assets/images/blog/comment.jpg',
    alt: 'img-size-30',
  },
  {
    imgClass: 'img-40 img-h-40',
    img: 'assets/images/blog/comment.jpg',
    alt: 'img-size-40',
  },
  {
    imgClass: 'img-50 img-h-50',
    img: 'assets/images/blog/comment.jpg',
    alt: 'img-size-50',
  },
  {
    imgClass: 'img-60 img-h-60',
    img: 'assets/images/blog/comment.jpg',
    alt: 'img-size-60',
  },
  {
    imgClass: 'img-70 img-h-70',
    img: 'assets/images/blog/comment.jpg',
    alt: 'img-size-70',
  },
  {
    imgClass: 'img-80 img-h-80',
    img: 'assets/images/blog/comment.jpg',
    alt: 'img-size-80',
  },
  {
    imgClass: 'img-90 img-h-90',
    img: 'assets/images/blog/comment.jpg',
    alt: 'img-size-90',
  },
  {
    imgClass: 'img-100 img-h-100',
    img: 'assets/images/blog/comment.jpg',
    alt: 'img-size-100',
  },
];

export const FontWeight = [
  {
    width: 100,
  },
  {
    width: 300,
  },
  {
    width: 400,
  },
  {
    width: 600,
  },
  {
    width: 700,
  },
  {
    width: 900,
  },
];

export const TextColors = [
  {
    textColor: 'font-primary',
  },
  {
    textColor: 'font-secondary',
  },
  {
    textColor: 'font-success',
  },
  {
    textColor: 'font-danger',
  },
  {
    textColor: 'font-warning',
  },
  {
    textColor: 'font-info',
  },
  {
    textColor: 'font-dark',
  },
];

export const padding = [
  {
    pClass: 'p-10',
  },
  {
    pClass: 'p-15',
  },
  {
    pClass: 'p-20',
  },
  {
    pClass: 'p-25',
  },
  {
    pClass: 'p-30',
  },
  {
    pClass: 'p-35',
  },
  {
    pClass: 'p-40',
  },
  {
    pClass: 'p-45',
  },
  {
    pClass: 'p-50',
  },
];

export const SidePadding: commanSide[] = [
  {
    header: 'Only One Side Padding',
    desc: 'Use the padding classes like: <code>.p-l-*/.p-r-*/.p-t-*/.p-b-*</code>',
    title: [
      {
        title: 'Padding Left',
        colClass: 'col-xxl-3 col-sm-6',
        item: [
          {
            text: '.p-l-10',
          },
          {
            text: '.p-l-15',
          },
          {
            text: '.p-l-20',
          },
          {
            text: '.p-l-25',
          },
          {
            text: '.p-l-30',
          },
          {
            text: '.p-l-35',
          },
          {
            text: '.p-l-40',
          },
          {
            text: '.p-l-45',
          },
          {
            text: '.p-l-50',
          },
        ],
      },
      {
        title: 'Padding Right',
        colClass: 'col-xxl-3 col-sm-6',
        item: [
          {
            text: '.p-r-10',
          },
          {
            text: '.p-r-15',
          },
          {
            text: '.p-r-20',
          },
          {
            text: '.p-r-25',
          },
          {
            text: '.p-r-30',
          },
          {
            text: '.p-r-35',
          },
          {
            text: '.p-r-40',
          },
          {
            text: '.p-r-45',
          },
          {
            text: '.p-r-50',
          },
        ],
      },
      {
        title: 'Padding Top',
        colClass: 'col-xxl-3 col-sm-6',
        item: [
          {
            text: '.p-t-10',
          },
          {
            text: '.p-t-15',
          },
          {
            text: '.p-t-20',
          },
          {
            text: '.p-t-25',
          },
          {
            text: '.p-t-30',
          },
          {
            text: '.p-t-35',
          },
          {
            text: '.p-t-40',
          },
          {
            text: '.p-t-45',
          },
          {
            text: '.p-t-50',
          },
        ],
      },
      {
        title: 'Padding Bottom',
        colClass: 'col-xxl-3 col-sm-6',
        item: [
          {
            text: '.p-b-10',
          },
          {
            text: '.p-b-15',
          },
          {
            text: '.p-b-20',
          },
          {
            text: '.p-b-25',
          },
          {
            text: '.p-b-30',
          },
          {
            text: '.p-b-35',
          },
          {
            text: '.p-b-40',
          },
          {
            text: '.p-b-45',
          },
          {
            text: '.p-b-50',
          },
        ],
      },
    ],
  },
];

export const SideMargin: commanSide[] = [
  {
    header: 'Only One Side Margin',
    desc: 'Use The Margin Classes Like: <code> .m-l-*/.m-r-*/.m-t-*/.m-b-*</code>',
    title: [
      {
        title: 'Margin Left',
        colClass: 'col-xxl-3 col-sm-6',
        item: [
          {
            text: '.m-l-10',
          },
          {
            text: '.m-l-15',
          },
          {
            text: '.m-l-20',
          },
          {
            text: '.m-l-25',
          },
          {
            text: '.m-l-30',
          },
          {
            text: '.m-l-35',
          },
          {
            text: '.m-l-40',
          },
          {
            text: '.m-l-45',
          },
          {
            text: '.m-l-50',
          },
        ],
      },
      {
        title: 'Margin Right',
        colClass: 'col-xxl-3 col-sm-6',
        item: [
          {
            text: '.m-r-10',
          },
          {
            text: '.m-r-15',
          },
          {
            text: '.m-r-20',
          },
          {
            text: '.m-r-25',
          },
          {
            text: '.m-r-30',
          },
          {
            text: '.m-r-35',
          },
          {
            text: '.m-r-40',
          },
          {
            text: '.m-r-45',
          },
          {
            text: '.m-r-50',
          },
        ],
      },
      {
        title: 'Margin Top',
        colClass: 'col-xxl-3 col-sm-6',
        item: [
          {
            text: '.m-t-10',
          },
          {
            text: '.m-t-15',
          },
          {
            text: '.m-t-20',
          },
          {
            text: '.m-t-25',
          },
          {
            text: '.m-t-30',
          },
          {
            text: '.m-t-35',
          },
          {
            text: '.m-t-40',
          },
          {
            text: '.m-t-45',
          },
          {
            text: '.m-t-50',
          },
        ],
      },
      {
        title: 'Margin Bottom',
        colClass: 'col-xxl-3 col-sm-6',
        item: [
          {
            text: '.m-b-10',
          },
          {
            text: '.m-b-15',
          },
          {
            text: '.m-b-20',
          },
          {
            text: '.m-b-25',
          },
          {
            text: '.m-b-30',
          },
          {
            text: '.m-b-35',
          },
          {
            text: '.m-b-40',
          },
          {
            text: '.m-b-45',
          },
          {
            text: '.m-b-50',
          },
        ],
      },
    ],
  },
];

export const margin = [
  {
    text: 'm-10',
  },
  {
    text: 'm-15',
  },
  {
    text: 'm-20',
  },
  {
    text: 'm-25',
  },
  {
    text: 'm-30',
  },
  {
    text: 'm-35',
  },
  {
    text: 'm-40',
  },
  {
    text: 'm-45',
  },
  {
    text: 'm-50',
  },
];

export const fontSizeData: data[] = [
  {
    text: 'Font-size .f-14',
    textClass: 'f-14',
  },
  {
    text: 'Font-size .f-16',
    textClass: 'f-16',
  },
  {
    text: 'Font-size .f-18',
    textClass: 'f-18',
  },
  {
    text: 'Font-size .f-20',
    textClass: 'f-20',
  },
  {
    text: 'Font-size .f-22',
    textClass: 'f-22',
  },
  {
    text: 'Font-size .f-24',
    textClass: 'f-24',
  },
  {
    text: 'Font-size .f-26',
    textClass: 'f-26',
  },
  {
    text: 'Font-size .f-28',
    textClass: 'f-28',
  },
  {
    text: 'Font-size .f-30',
    textClass: 'f-30',
  },
  {
    text: 'Font-size .f-32',
    textClass: 'f-32',
  },
  {
    text: 'Font-size .f-34',
    textClass: 'f-34',
  },
  {
    text: 'Font-size .f-36',
    textClass: 'f-36',
  },
  {
    text: 'Font-size .f-38',
    textClass: 'f-38',
  },
  {
    text: 'Font-size .f-40',
    textClass: 'f-40',
  },
];
