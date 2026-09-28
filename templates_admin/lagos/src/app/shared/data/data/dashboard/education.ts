export interface featuredCourse {
  id: number;
  image: string;
  title: string;
  subTitle: string;
  start: string;
  starValue: number;
  type: string;
  status: boolean;
}

export const commonEducationData = [
  {
    count: '42,954',
    class: 'student',
    title: 'Total Students',
    color: 'danger',
    percentage: '- 17.06%',
    month: 6,
    iconArrow: 'down',
    image: 'assets/images/dashboard-4/icon/student.png',
  },
  {
    count: '659',
    class: 'student-2',
    title: 'Total Teachers',
    color: 'success',
    percentage: '+ 27.02%',
    month: 4,
    iconArrow: 'up',
    image: 'assets/images/dashboard-4/icon/teacher.png',
  },
  {
    count: '984',
    class: 'student-3',
    title: 'Events',
    color: 'success',
    percentage: '+ 12.01%',
    month: 8,
    iconArrow: 'up',
    image: 'assets/images/dashboard-4/icon/calendar.png',
  },
  {
    count: '1,984',
    class: 'student-4',
    title: 'Invoice Status',
    color: 'danger',
    percentage: '- 15.02%',
    month: 5,
    iconArrow: 'down',
    image: 'assets/images/dashboard-4/icon/invoice.png',
  },
];

export const enrolledClasses = [
  {
    id: 1,
    title: 'After Effects CC Masterclass',
    time: '10:20 -11:30',
    color: 'primary',
  },
  {
    id: 2,
    title: 'Design from A to Z',
    time: '09:00 -10:30',
    color: 'secondary',
  },
  {
    id: 3,
    title: 'Graphic Design Bootcamp',
    time: '15:00 -16:00',
    color: 'warning',
  },
  {
    id: 4,
    title: 'The Ultimate Guide to Usabillity',
    time: '13:25 -14:30',
    color: 'tertiary',
  },
  {
    id: 5,
    title: 'After Effects CC Masterclass',
    time: '12:45 -14:20',
    color: 'success',
  },
];

export const Assignments = [
  {
    id: '0542',
    image: 'assets/images/dashboard-4/user/1.png',
    teacher: 'Gary payi',
    subject: 'Accounts',
    startDate: '12 May 2024',
    endDate: '20 May 2024',
    progressColor: 'primary',
    percentages: '80%',
  },
  {
    id: '9548',
    image: 'assets/images/dashboard-4/user/2.png',
    teacher: 'Ralph Waters',
    subject: 'UI/UX Design',
    startDate: '06 May 2024',
    endDate: '16 May 2024',
    progressColor: 'secondary',
    percentages: '60%',
  },
  {
    id: '2950',
    image: 'assets/images/dashboard-4/user/3.png',
    teacher: 'Edwin Day',
    subject: 'Mathematics',
    startDate: '25 Sep 2024',
    endDate: '30 May 2024',
    progressColor: 'warning',
    percentages: '50%',
  },
  {
    id: '9605',
    image: 'assets/images/dashboard-4/user/4.png',
    teacher: 'Aaron Hogan',
    subject: 'Computer App',
    startDate: '23 May 2024',
    endDate: '26 May 2024',
    progressColor: 'tertiary',
    percentages: '65%',
  },
  // {
  //   id: '1552',
  //   image: "assets/images/dashboard-4/user/2.png",
  //   teacher:'Ralph Waters',
  //   subject :'Accounts',
  //   startDate:'15 May 2024',
  //   endDate:'26 May 2024',
  //   progressColor:'success',
  //   percentages:'40%'
  // },
  // {
  //   id: '125',
  //   image: "assets/images/dashboard-4/user/3.pngg",
  //   teacher:'Aaron Hogan',
  //   subject :'Accounts',
  //   startDate:'05 May 2024',
  //   endDate:'19 May 2024',
  //   progressColor:'danger',
  //   percentages:'70%'
  // },
  // {
  //   id: '254',
  //   image: "assets/images/dashboard-4/user/1.png",
  //   teacher:'Gary payi',
  //   subject :'Accounts',
  //   startDate:'22 May 2024',
  //   endDate:'02 May 2024',
  //   progressColor:'info',
  //   percentages:'25%'
  // },
];

export const featuredCourses: featuredCourse[] = [
  {
    id: 3,
    image: 'assets/images/dashboard-4/featured/3.png',
    title: 'Design System',
    subTitle: 'Anna Green',
    start: 'Jun 28',
    starValue: 1.5,
    type: 'Developer',
    status: false,
  },
  {
    id: 5,
    image: 'assets/images/dashboard-4/featured/5.png',
    title: 'Latest Figma',
    subTitle: 'Dylan Field',
    start: 'jun 01',
    starValue: 5.4,
    type: 'Graphic Designer',
    status: false,
  },
  {
    id: 4,
    image: 'assets/images/dashboard-4/featured/4.png',
    title: 'Leadership',
    subTitle: 'John  Elliot',
    start: 'Apr 04',
    starValue: 2.4,
    type: 'UX/UI Design',
    status: false,
  },
  {
    id: 1,
    image: 'assets/images/dashboard-4/featured/1.png',
    title: 'Mobile UX',
    subTitle: 'Erin Mooney',
    start: 'Feb 15',
    starValue: 4.8,
    type: 'UX/UI Design',
    status: false,
  },
  {
    id: 2,
    image: 'assets/images/dashboard-4/featured/2.png',
    title: 'Illustration',
    subTitle: 'Elsie Lemon',
    start: 'Mar 22',
    starValue: 2.3,
    type: 'Web Designer',
    status: false,
  },
];
