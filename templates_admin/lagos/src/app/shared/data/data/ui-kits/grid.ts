export interface gridOption {
  title: string;
  size: string;
}

export const gridOptionData: gridOption[] = [
  {
    title: 'Extra small',
    size: '<576px',
  },
  {
    title: 'Small',
    size: '≥576px',
  },
  {
    title: 'Medium',
    size: '≥768px',
  },
  {
    title: 'Large',
    size: '≥992px',
  },
  {
    title: 'Extra large',
    size: '≥1200px',
  },
  {
    title: 'Extra extra large',
    size: '≥1400px',
  },
];

export const gridOptionData2 = [
  {
    title: 'Max container width',
    data: [
      { text: 'None (auto)' },
      { text: '540px' },
      { text: '720px' },
      { text: '960px' },
      { text: '1140px' },
      { text: '1320px' },
    ],
  },
  {
    title: 'Class prefix',
    data: [
      { text: '<code>.col-</code>' },
      { text: '<code>.col-sm-</code>' },
      { text: '<code>.col-md-</code>' },
      { text: '<code>.col-lg-</code>' },
      { text: '<code>.col-xl-</code>' },
      { text: '<code>.col-xxl-</code>' },
    ],
  },
];

export const gridOptionData3 = [
  {
    title: '# of columns',
    text: '12',
  },
  {
    title: 'Gutter width',
    text: '1.5rem (.75rem on left and right)',
  },
  {
    title: 'Nestable',
    text: 'Yes',
  },
  {
    title: 'Offsets',
    text: 'Yes',
  },
  {
    title: 'Column ordering',
    text: 'Yes',
  },
];

export const gridColumnData = [
  { size: 1, text: 'col-md-1' },
  { size: 2, text: 'col-md-2' },
  { size: 2, text: 'col-md-2' },
  { size: 3, text: 'col-md-3' },
  { size: 4, text: 'col-md-4' },
  { size: 5, text: 'col-md-5' },
  { size: 7, text: 'col-md-7' },
  { size: 6, text: 'col-md-6' },
  { size: 6, text: 'col-md-6' },
  { size: 8, text: 'col-md-8' },
  { size: 4, text: 'col-md-4' },
  { size: 9, text: 'col-md-9' },
  { size: 3, text: 'col-md-3' },
  { size: 10, text: 'col-md-10' },
  { size: 2, text: 'col-md-2' },
  { size: 12, text: 'col-md-12' },
];

export const alignmentData = [
  {
    class: 'start',
    data: [{ text: 'one column' }, { text: 'two column' }],
  },
  {
    class: 'center',
    data: [{ text: 'one column' }, { text: 'two column' }],
  },
  {
    class: 'end',
    data: [{ text: 'one column' }, { text: 'two column' }],
  },
];

export const orderGridData = [
  { class: 'col-3 order-3', text: 'First Item (order-3)' },
  { class: 'col-5 order-first', text: 'Second Item (order-first)' },
  { class: 'col-4 order-last', text: 'Third Item (order-last)' },
  { class: 'col-3 order-2', text: 'Fourth Item (order-2)' },
  { class: 'col-sm-2 col-4 order-5', text: 'fifth Item (order-5)' },
  { class: 'col-sm-6 col-4 order-4', text: 'sixth Item (order-4)' },
];

export const offsetGridData = [
  { class: 'col-sm-5 col-4 offset-sm-3 offset-2', text: 'col-5 offset-3' },
  { class: 'col-sm-2 col-4 offset-sm-2 offset-1', text: 'col-2 offset-2' },
  { class: 'col-sm-4 col-5 offset-2', text: 'col-4 offset-2' },
  { class: 'col-sm-3 col-4 offset-sm-2 offset-1', text: 'col-3 offset-2' },
];
