export interface commonSwitch {
  id: number;
  title: string;
  class: string;
  data: data[];
}

export interface data {
  color: string;
  text: string;
}

export const touchspin = [
  {
    title: 'Default Touchspin',
    class: 'touchspin',
    id: 0,
    data: [
      {
        id: 0,
        color: 'primary',
        value: 0,
      },
      {
        id: 1,
        color: 'secondary',
        value: 2,
      },
      {
        id: 2,
        color: 'success',
        value: 1,
      },
      {
        id: 3,
        color: 'danger',
        value: 8,
      },
      {
        id: 4,
        color: 'warning',
        value: 3,
      },
      {
        id: 5,
        color: 'info',
        value: 9,
      },
      {
        id: 6,
        color: 'dark',
        value: 4,
      },
    ],
  },
  {
    title: 'Outlined touchspin',
    class: 'spin-border',
    id: 1,
    data: [
      {
        id: 0,
        color: 'primary',
        value: 0,
      },
      {
        id: 1,
        color: 'secondary',
        value: 2,
      },
      {
        id: 2,
        color: 'success',
        value: 1,
      },
      {
        id: 3,
        color: 'danger',
        value: 8,
      },
      {
        id: 4,
        color: 'warning',
        value: 3,
      },
      {
        id: 5,
        color: 'info',
        value: 9,
      },
      {
        id: 6,
        color: 'dark',
        value: 4,
      },
    ],
  },
];

export const roundedTouchspin = [
  {
    id: 0,
    color: 'primary',
    value: 0,
  },
  {
    id: 1,
    color: 'secondary',
    value: 2,
  },
  {
    id: 2,
    color: 'success',
    value: 1,
  },
  {
    id: 3,
    color: 'danger',
    value: 8,
  },
  {
    id: 4,
    color: 'warning',
    value: 3,
  },
  {
    id: 5,
    color: 'info',
    value: 9,
  },
  {
    id: 6,
    color: 'dark',
    value: 4,
  },
];

export const defaultSwitch = [
  { color: 'primary' },
  { color: 'secondary' },
  { color: 'success' },
  { color: 'danger' },
  { color: 'warning' },
  { color: 'info' },
  { color: 'dark' },
];

export const iconSwitchButton: commonSwitch[] = [
  {
    id: 1,
    title: 'Icons Switch',
    class: 'text-end icon-state',
    data: [
      {
        color: 'primary',
        text: 'Primary Switch',
      },
      {
        color: 'secondary',
        text: 'Secondary Switch',
      },
      {
        color: 'success',
        text: 'Success Switch',
      },
      {
        color: 'danger',
        text: 'Danger Switch',
      },
      {
        color: 'warning',
        text: 'Warning Switch',
      },
      {
        color: 'info',
        text: 'Info Switch',
      },
      {
        color: 'dark',
        text: 'Dark Switch',
      },
    ],
  },
];

export const uncheckedSwitch: commonSwitch[] = [
  {
    id: 2,
    title: 'Unchecked switch',
    class: 'text-end',
    data: [
      {
        color: 'primary',
        text: 'Unchecked Primary Switch',
      },
      {
        color: 'secondary',
        text: 'Unchecked Secondary Switch',
      },
      {
        color: 'success',
        text: 'Unchecked Success Switch',
      },
      {
        color: 'danger',
        text: 'Unchecked Danger Switch',
      },
      {
        color: 'warning',
        text: 'Unchecked Warning Switch',
      },
      {
        color: 'info',
        text: 'Unchecked Info Switch',
      },
      {
        color: 'dark',
        text: 'Unchecked Dark Switch',
      },
    ],
  },
];

export const borderWithIcon: commonSwitch[] = [
  {
    id: 3,
    title: 'Borders with icons',
    class: 'text-end icon-state switch-outline',
    data: [
      {
        color: 'primary',
        text: 'Bordered Primary Switch',
      },
      {
        color: 'secondary',
        text: 'Bordered Secondary Switch',
      },
      {
        color: 'success',
        text: 'Bordered Success Switch',
      },
      {
        color: 'danger',
        text: 'Bordered Danger Switch',
      },
      {
        color: 'warning',
        text: 'Bordered Warning Switch',
      },
      {
        color: 'info',
        text: 'Bordered Info Switch',
      },
      {
        color: 'dark',
        text: 'Bordered Dark Switch',
      },
    ],
  },
];

export const switchIcanSizingData = [
  {
    title: 'Small Size',
    class: 'sm',
    active: true,
    disable: true,
  },
  {
    title: 'Small Size Unhecked',
    class: 'sm',
    active: false,
    disable: false,
  },
  {
    title: 'Normal Size',
    class: '',
    active: true,
    disable: false,
  },
  {
    title: 'Normal Unhecked',
    class: '',
    active: false,
    disable: false,
  },
  {
    title: 'Disabled With Icon',
    class: '',
    active: false,
    disable: true,
  },
  {
    title: 'Large Size',
    class: 'lg',
    active: true,
    disable: false,
  },
  {
    title: 'Large Unhecked',
    class: 'lg',
    active: false,
    disable: false,
  },
  {
    title: 'Disabled',
    class: 'lg',
    active: false,
    disable: true,
  },
];

export const switchSizing = [
  {
    title: 'Small Size',
    class: 'sm',
    active: true,
    disable: true,
  },
  {
    title: 'Small Size Unhecked',
    class: 'sm',
    active: false,
    disable: false,
  },
  {
    title: 'Normal Size',
    class: '',
    active: true,
    disable: false,
  },
  {
    title: 'Normal Unhecked',
    class: '',
    active: false,
    disable: false,
  },
  {
    title: 'Disabled State',
    class: '',
    active: false,
    disable: true,
  },
  {
    title: 'Large Size',
    class: 'lg',
    active: true,
    disable: false,
  },
  {
    title: 'Large Unhecked',
    class: 'lg',
    active: false,
    disable: false,
  },
  {
    title: 'Disabled',
    class: 'lg',
    active: false,
    disable: true,
  },
];

export const state = [
  'Alabama',
  'Alaska',
  'American Samoa',
  'Arizona',
  'Arkansas',
  'California',
  'Colorado',
  'Connecticut',
  'Delaware',
  'District Of Columbia',
  'Federated States Of Micronesia',
  'Florida',
  'Georgia',
  'Guam',
  'Hawaii',
  'Idaho',
  'Illinois',
  'Indiana',
  'Iowa',
  'Kansas',
  'Kentucky',
  'Louisiana',
  'Maine',
  'Marshall Islands',
  'Maryland',
  'Massachusetts',
  'Michigan',
  'Minnesota',
  'Mississippi',
  'Missouri',
  'Montana',
  'Nebraska',
  'Nevada',
  'New Hampshire',
  'New Jersey',
  'New Mexico',
  'New York',
  'North Carolina',
  'North Dakota',
  'Northern Mariana Islands',
  'Ohio',
  'Oklahoma',
  'Oregon',
  'Palau',
  'Pennsylvania',
  'Puerto Rico',
  'Rhode Island',
  'South Carolina',
  'South Dakota',
  'Tennessee',
  'Texas',
  'Utah',
  'Vermont',
  'Virgin Islands',
  'Virginia',
  'Washington',
  'West Virginia',
  'Wisconsin',
  'Wyoming',
];

export interface statedDataInterface {
  id: number;
  name: string;
}

export const statesData: statedDataInterface[] = [
  { id: 0, name: 'Alabama' },
  { id: 1, name: 'Alaska' },
  { id: 2, name: 'American Samoa' },
  { id: 3, name: 'Arizona' },
  { id: 4, name: 'Arkansas' },
  { id: 5, name: 'California' },
  { id: 6, name: 'Colorado' },
  { id: 7, name: 'Connecticut' },
  { id: 8, name: 'Delaware' },
  { id: 9, name: 'District Of Columbia' },
  { id: 10, name: 'Federated States Of Micronesia' },
  { id: 11, name: 'Florida' },
  { id: 12, name: 'Georgia' },
  { id: 13, name: 'Guam' },
  { id: 14, name: 'Hawaii' },
  { id: 15, name: 'Idaho' },
  { id: 16, name: 'Illinois' },
  { id: 17, name: 'Indiana' },
  { id: 18, name: 'Iowa' },
  { id: 19, name: 'Kansas' },
  { id: 20, name: 'Kentucky' },
  { id: 21, name: 'Louisiana' },
  { id: 22, name: 'Maine' },
  { id: 23, name: 'Marshall Islands' },
  { id: 24, name: 'Maryland' },
  { id: 25, name: 'Massachusetts' },
  { id: 26, name: 'Michigan' },
  { id: 27, name: 'Minnesota' },
  { id: 28, name: 'Mississippi' },
  { id: 29, name: 'Missouri' },
  { id: 30, name: 'Montana' },
  { id: 31, name: 'Nebraska' },
  { id: 32, name: 'Nevada' },
  { id: 33, name: 'New Hampshire' },
  { id: 34, name: 'New Jersey' },
  { id: 35, name: 'New Mexico' },
  { id: 36, name: 'New York' },
  { id: 37, name: 'North Carolina' },
  { id: 38, name: 'North Dakota' },
  { id: 39, name: 'Northern Mariana Islands' },
  { id: 40, name: 'Ohio' },
  { id: 41, name: 'Oklahoma' },
  { id: 42, name: 'Oregon' },
  { id: 43, name: 'Palau' },
  { id: 44, name: 'Pennsylvania' },
  { id: 45, name: 'Puerto Rico' },
  { id: 46, name: 'Rhode Island' },
  { id: 47, name: 'South Carolina' },
  { id: 48, name: 'South Dakota' },
  { id: 49, name: 'Tennessee' },
  { id: 50, name: 'Texas' },
  { id: 51, name: 'Utah' },
  { id: 52, name: 'Vermont' },
  { id: 53, name: 'Virgin Islands' },
  { id: 54, name: 'Virginia' },
  { id: 55, name: 'Washington' },
  { id: 56, name: 'West Virginia' },
  { id: 57, name: 'Wisconsin' },
  { id: 58, name: 'Wyoming' },
];

export const statesWithFlags: { name: string; flag: string }[] = [
  { name: 'Alabama', flag: '5/5c/Flag_of_Alabama.svg/45px-Flag_of_Alabama.svg.png' },
  { name: 'Alaska', flag: 'e/e6/Flag_of_Alaska.svg/43px-Flag_of_Alaska.svg.png' },
  { name: 'Arizona', flag: '9/9d/Flag_of_Arizona.svg/45px-Flag_of_Arizona.svg.png' },
  { name: 'Arkansas', flag: '9/9d/Flag_of_Arkansas.svg/45px-Flag_of_Arkansas.svg.png' },
  { name: 'California', flag: '0/01/Flag_of_California.svg/45px-Flag_of_California.svg.png' },
  { name: 'Colorado', flag: '4/46/Flag_of_Colorado.svg/45px-Flag_of_Colorado.svg.png' },
  { name: 'Connecticut', flag: '9/96/Flag_of_Connecticut.svg/39px-Flag_of_Connecticut.svg.png' },
  { name: 'Delaware', flag: 'c/c6/Flag_of_Delaware.svg/45px-Flag_of_Delaware.svg.png' },
  { name: 'Florida', flag: 'f/f7/Flag_of_Florida.svg/45px-Flag_of_Florida.svg.png' },
  {
    name: 'Georgia',
    flag: '5/54/Flag_of_Georgia_%28U.S._state%29.svg/46px-Flag_of_Georgia_%28U.S._state%29.svg.png',
  },
  { name: 'Hawaii', flag: 'e/ef/Flag_of_Hawaii.svg/46px-Flag_of_Hawaii.svg.png' },
  { name: 'Idaho', flag: 'a/a4/Flag_of_Idaho.svg/38px-Flag_of_Idaho.svg.png' },
  { name: 'Illinois', flag: '0/01/Flag_of_Illinois.svg/46px-Flag_of_Illinois.svg.png' },
  { name: 'Indiana', flag: 'a/ac/Flag_of_Indiana.svg/45px-Flag_of_Indiana.svg.png' },
  { name: 'Iowa', flag: 'a/aa/Flag_of_Iowa.svg/44px-Flag_of_Iowa.svg.png' },
  { name: 'Kansas', flag: 'd/da/Flag_of_Kansas.svg/46px-Flag_of_Kansas.svg.png' },
  { name: 'Kentucky', flag: '8/8d/Flag_of_Kentucky.svg/46px-Flag_of_Kentucky.svg.png' },
  { name: 'Louisiana', flag: 'e/e0/Flag_of_Louisiana.svg/46px-Flag_of_Louisiana.svg.png' },
  { name: 'Maine', flag: '3/35/Flag_of_Maine.svg/45px-Flag_of_Maine.svg.png' },
  { name: 'Maryland', flag: 'a/a0/Flag_of_Maryland.svg/45px-Flag_of_Maryland.svg.png' },
  {
    name: 'Massachusetts',
    flag: 'f/f2/Flag_of_Massachusetts.svg/46px-Flag_of_Massachusetts.svg.png',
  },
  { name: 'Michigan', flag: 'b/b5/Flag_of_Michigan.svg/45px-Flag_of_Michigan.svg.png' },
  { name: 'Minnesota', flag: 'b/b9/Flag_of_Minnesota.svg/46px-Flag_of_Minnesota.svg.png' },
  { name: 'Mississippi', flag: '4/42/Flag_of_Mississippi.svg/45px-Flag_of_Mississippi.svg.png' },
  { name: 'Missouri', flag: '5/5a/Flag_of_Missouri.svg/46px-Flag_of_Missouri.svg.png' },
  { name: 'Montana', flag: 'c/cb/Flag_of_Montana.svg/45px-Flag_of_Montana.svg.png' },
  { name: 'Nebraska', flag: '4/4d/Flag_of_Nebraska.svg/46px-Flag_of_Nebraska.svg.png' },
  { name: 'Nevada', flag: 'f/f1/Flag_of_Nevada.svg/45px-Flag_of_Nevada.svg.png' },
  {
    name: 'New Hampshire',
    flag: '2/28/Flag_of_New_Hampshire.svg/45px-Flag_of_New_Hampshire.svg.png',
  },
  { name: 'New Jersey', flag: '9/92/Flag_of_New_Jersey.svg/45px-Flag_of_New_Jersey.svg.png' },
  { name: 'New Mexico', flag: 'c/c3/Flag_of_New_Mexico.svg/45px-Flag_of_New_Mexico.svg.png' },
  { name: 'New York', flag: '1/1a/Flag_of_New_York.svg/46px-Flag_of_New_York.svg.png' },
  {
    name: 'North Carolina',
    flag: 'b/bb/Flag_of_North_Carolina.svg/45px-Flag_of_North_Carolina.svg.png',
  },
  { name: 'North Dakota', flag: 'e/ee/Flag_of_North_Dakota.svg/38px-Flag_of_North_Dakota.svg.png' },
  { name: 'Ohio', flag: '4/4c/Flag_of_Ohio.svg/46px-Flag_of_Ohio.svg.png' },
  { name: 'Oklahoma', flag: '6/6e/Flag_of_Oklahoma.svg/45px-Flag_of_Oklahoma.svg.png' },
  { name: 'Oregon', flag: 'b/b9/Flag_of_Oregon.svg/46px-Flag_of_Oregon.svg.png' },
  { name: 'Pennsylvania', flag: 'f/f7/Flag_of_Pennsylvania.svg/45px-Flag_of_Pennsylvania.svg.png' },
  { name: 'Rhode Island', flag: 'f/f3/Flag_of_Rhode_Island.svg/32px-Flag_of_Rhode_Island.svg.png' },
  {
    name: 'South Carolina',
    flag: '6/69/Flag_of_South_Carolina.svg/45px-Flag_of_South_Carolina.svg.png',
  },
  { name: 'South Dakota', flag: '1/1a/Flag_of_South_Dakota.svg/46px-Flag_of_South_Dakota.svg.png' },
  { name: 'Tennessee', flag: '9/9e/Flag_of_Tennessee.svg/46px-Flag_of_Tennessee.svg.png' },
  { name: 'Texas', flag: 'f/f7/Flag_of_Texas.svg/45px-Flag_of_Texas.svg.png' },
  { name: 'Utah', flag: 'f/f6/Flag_of_Utah.svg/45px-Flag_of_Utah.svg.png' },
  { name: 'Vermont', flag: '4/49/Flag_of_Vermont.svg/46px-Flag_of_Vermont.svg.png' },
  { name: 'Virginia', flag: '4/47/Flag_of_Virginia.svg/44px-Flag_of_Virginia.svg.png' },
  { name: 'Washington', flag: '5/54/Flag_of_Washington.svg/46px-Flag_of_Washington.svg.png' },
  {
    name: 'West Virginia',
    flag: '2/22/Flag_of_West_Virginia.svg/46px-Flag_of_West_Virginia.svg.png',
  },
  { name: 'Wisconsin', flag: '2/22/Flag_of_Wisconsin.svg/45px-Flag_of_Wisconsin.svg.png' },
  { name: 'Wyoming', flag: 'b/bc/Flag_of_Wyoming.svg/43px-Flag_of_Wyoming.svg.png' },
];
