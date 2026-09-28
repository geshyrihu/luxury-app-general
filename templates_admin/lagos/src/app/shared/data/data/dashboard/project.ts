import { commonData1, commonData2, commonData3, commonData4 } from '../../chart/general/apex-chart';

export interface userProfileData {
  image: string;
  title: string;
  userName: string;
  email: string;
  btn1: string;
  btn2: string;
  color1: string;
  color2: string;
  issue: number;
  resolved: number;
  comment: number;
  completed: number;
  progressClass: string;
  progressPrecentage: string;
}

export const projectStatus = [
  {
    id: 1,
    image: 'assets/images/dashboard-2/svg-icon/calendar.png',
    heading: 'Upcomings',
    title: '5 Projects',
    bgColor: 'primary',
  },
  {
    id: 2,
    image: 'assets/images/dashboard-2/svg-icon/check.png',
    heading: 'Completed',
    title: '27 Projects',
    bgColor: 'secondary',
  },
  {
    id: 3,
    image: 'assets/images/dashboard-2/svg-icon/processing.png',
    heading: 'In Progress',
    title: '13 Projects',
    bgColor: 'warning',
  },
  {
    id: 4,
    image: 'assets/images/dashboard-2/svg-icon/total.png',
    heading: 'Total',
    title: '47 Projects',
    bgColor: 'tertiary',
  },
];

export const websiteDesign: userProfileData[] = [
  {
    image: 'assets/images/dashboard-2/user/16.png',
    title: 'Website Design',
    userName: 'Square Dashboard',
    email: 'karson123@gmail.com',
    btn1: 'UX Design',
    btn2: '3D Deisgn',
    color1: 'primary',
    color2: 'secondary',
    issue: 12,
    resolved: 5,
    comment: 7,
    completed: 6,
    progressClass: 'primary',
    progressPrecentage: '50%',
  },
];

export const socialPostDesign: userProfileData[] = [
  {
    image: 'assets/images/dashboard-2/user/18.png',
    title: 'Social Post Design',
    userName: 'Cronin Lewis',
    email: 'cronin324@gmail.com',
    btn1: 'Illustration',
    btn2: 'Video Editing',
    color1: 'primary',
    color2: 'warning',
    issue: 10,
    resolved: 9,
    comment: 5,
    completed: 4,
    progressClass: 'secondary',
    progressPrecentage: '40%',
  },
];

export const podcastWebDesign: userProfileData[] = [
  {
    image: 'assets/images/dashboard-2/user/17.png',
    title: 'Podcast Web design',
    userName: 'Rau Foster',
    email: 'raufoster23@gmail.com',
    btn1: '2D Design',
    btn2: 'Dribbble Post',
    color1: 'tertiary',
    color2: 'secondary',
    issue: 16,
    resolved: 10,
    comment: 7,
    completed: 7,
    progressClass: 'warning',
    progressPrecentage: '80%',
  },
];

export const cryptoDashboard: userProfileData[] = [
  {
    image: 'assets/images/dashboard-2/user/19.png',
    title: 'Crypto Dashboard',
    userName: 'Volkman Melisa',
    email: 'volkman839@gmail.com',
    btn1: 'Design System',
    btn2: 'Branding',
    color1: 'primary',
    color2: 'secondary',
    issue: 4,
    resolved: 5,
    comment: 7,
    completed: 2,
    progressClass: 'tertiary',
    progressPrecentage: '20%',
  },
];

export const todaysTask = [
  {
    id: 1,
    title: 'NFT illustrarion Package',
    image: 'assets/images/dashboard-2/user/17.png',
    name: 'Hackett Yessenia',
    font: 'primary',
  },
  {
    id: 2,
    title: 'Podcast landing Page',
    image: 'assets/images/dashboard-2/user/13.png',
    image1: 'assets/images/dashboard-2/user/14.png',
    name: 'schneider..',
    font: 'secondary',
  },
  {
    id: 3,
    title: 'Delivery Food App',
    image: 'assets/images/dashboard-2/user/15.png',
    name: 'Mahdi Gholizadeh',
    font: 'warning',
  },
];

export const tableData = [
  {
    id: 1,
    active: true,
    name: 'Behance Post',
    image: [
      {
        image: 'assets/images/dashboard-2/user/1.png',
      },
      {
        image: 'assets/images/dashboard-2/user/2.png',
      },
    ],
    started: '05Jan23',
    finished: '12Jan23',
    chartId: 'widgetsChart1',
    options: commonData1,
  },
  {
    id: 2,
    active: false,
    name: 'Figma Design',
    image: [
      {
        image: 'assets/images/dashboard-2/user/4.png',
      },
      {
        image: 'assets/images/dashboard-2/user/6.png',
      },
      {
        image: 'assets/images/dashboard-2/user/5.png',
      },
    ],
    started: '11Feb23',
    finished: '24Feb23',
    chartId: 'widgetsChart2',
    options: commonData2,
  },
  {
    id: 3,
    active: true,
    name: 'Web Page',
    image: [
      {
        image: 'assets/images/dashboard-2/user/7.png',
      },
      {
        image: 'assets/images/dashboard-2/user/8.png',
      },
    ],
    started: '17Mar23',
    finished: '08Mar23',
    chartId: 'widgetsChart3',
    options: commonData3,
  },
  {
    id: 4,
    active: false,
    name: 'CRM Admin',
    image: [
      {
        image: 'assets/images/dashboard-2/user/12.png',
      },
      {
        image: 'assets/images/dashboard-2/user/11.png',
      },
      {
        image: 'assets/images/dashboard-2/user/12.png',
      },
    ],
    started: '05Sep23',
    finished: '13Sep23',
    chartId: 'widgetsChart4',
    options: commonData4,
  },
];

export const ClientActivity = [
  {
    id: 1,
    image: 'assets/images/dashboard-2/svg-icon/1.png',
    title: 'Redesign Layout',
    subTitle: 'Anna Catmire',
    timeLine: 'Sep 20 - Oct 26',
    porjectTeam: [
      {
        image: 'assets/images/dashboard-2/user/1.png',
      },
      {
        image: 'assets/images/dashboard-2/user/12.png',
      },
      {
        image: 'assets/images/dashboard-2/user/3.png',
      },
    ],
    projectType: 'UI/UX Design',
    active: true,
    bgColor: 'primary',
    progress: '40%',
  },
  {
    id: 2,
    image: 'assets/images/dashboard-2/svg-icon/2.png',
    title: 'Login & Sign Up Ui',
    subTitle: 'John Elliot',
    timeLine: 'Mar 16 - Apr 10',
    porjectTeam: [
      {
        image: 'assets/images/dashboard-2/user/4.png',
      },
      {
        image: 'assets/images/dashboard-2/user/5.png',
      },
      {
        image: 'assets/images/dashboard-2/user/6.png',
      },
    ],
    projectType: 'Designer',
    active: false,
    bgColor: 'secondary',
    progress: '70%',
  },
  {
    id: 3,
    image: 'assets/images/dashboard-2/svg-icon/3.png',
    title: 'Redesign CRM',
    subTitle: 'Ashley Hart',
    timeLine: 'May 09 - Jun 02',
    porjectTeam: [
      {
        image: 'assets/images/dashboard-2/user/7.png',
      },
      {
        image: 'assets/images/dashboard-2/user/8.png',
      },
      {
        image: 'assets/images/dashboard-2/user/9.png',
      },
    ],
    projectType: 'UI/UX Design',
    active: true,
    bgColor: 'warning',
    progress: '50%',
  },
  {
    id: 4,
    image: 'assets/images/dashboard-2/svg-icon/4.png',
    title: 'Front-End Website',
    subTitle: 'Dana Lemon',
    timeLine: 'Jul 12 - Aug 20',
    porjectTeam: [
      {
        image: 'assets/images/dashboard-2/user/10.png',
      },
      {
        image: 'assets/images/dashboard-2/user/11.png',
      },
      {
        image: 'assets/images/dashboard-2/user/12.png',
      },
    ],
    projectType: 'UI/UX Design',
    active: false,
    bgColor: 'tertiary',
    progress: '50%',
  },
];
