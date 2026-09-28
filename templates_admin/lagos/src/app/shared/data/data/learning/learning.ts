export interface comments {
  img: string;
  name: string;
  designation: string;
  hits: string;
  comments: number;
  desc: string;
  reply: boolean;
}

export const findCourse = [
  {
    id: 1,
    title: 'Categories',
    type: 'checkbox',
    check: [
      {
        checkId: 'chk-ani',
        checkTitle: 'Accounting',
        active: false,
      },
      {
        checkId: 'chk-ani0',
        checkTitle: 'Design',
        active: false,
      },
      {
        checkId: 'chk-ani1',
        checkTitle: 'Development',
        active: false,
      },
      {
        checkId: 'chk-ani2',
        checkTitle: 'Management',
        active: false,
      },
    ],
  },
  {
    id: 2,
    title: 'Duration',
    type: 'checkbox',
    checkId: 'chk-ani',
    check: [
      {
        checkId: 'chk-ani6',
        checkTitle: '0-50 hours',
        active: false,
      },
      {
        checkId: 'chk-ani7',
        checkTitle: '50-100 hours',
        active: false,
      },
      {
        checkId: 'chk-ani8',
        checkTitle: '100+ hours',
        active: false,
      },
    ],
  },
  {
    id: 3,
    title: 'Price',
    buttonType: 'radio',
    type: 'radio',
    check: [
      {
        checkId: 'edo-ani',
        checkTitle: 'All Courses',
        active: false,
      },
      {
        checkId: 'edo-ani1',
        checkTitle: 'Paid Courses',
        active: false,
      },
      {
        checkId: 'edo-ani2',
        checkTitle: 'Free Courses',
        active: true,
      },
    ],
  },
  {
    id: 4,
    title: 'Status',
    type: 'checkbox',
    checkId: 'chk-ani',
    check: [
      {
        checkId: 'chk-ani3',
        checkTitle: 'Registration',
        active: false,
      },
      {
        checkId: 'chk-ani4',
        checkTitle: 'Progress',
        active: false,
      },
      {
        checkId: 'chk-ani5',
        checkTitle: 'Completed',
        active: false,
      },
    ],
  },
];

export const Categorie = [
  {
    title: 'Design',
    padding: false,
    isCollapsed: false,
    designer: [
      {
        designerTitle: 'UI Design',
        count: '28',
      },
      {
        designerTitle: 'UX Design',
        count: '35',
      },
      {
        designerTitle: 'Interface Design',
        count: '17',
      },
      {
        designerTitle: 'User Experience',
        count: '26',
      },
    ],
  },
  {
    title: 'Development',
    padding: true,
    designer: [
      {
        designerTitle: 'Frontend Development',
        count: '48',
      },
      {
        designerTitle: 'Backend Development',
        count: '19',
      },
    ],
  },
];

export const upcomingCourse = [
  {
    title: 'UX Development',
    courseBy: ' Lorem ipsum',
    rating: 4.5,
    day: '18',
    month: 'Dec',
  },
  {
    title: 'Business Analyst',
    courseBy: 'Lorem ipsum',
    rating: 5,
    day: '28',
    month: 'Dec',
  },
  {
    title: 'Web Development',
    courseBy: 'Lorem ipsum',
    rating: 4,
    day: '5',
    month: 'Jan',
  },
];

export const learningTopData = [
  {
    id: 1,
    img: 'assets/images/faq/1.jpg',
    date: '05',
    month: 'January 2024',
    title: 'Java Language',
    by: 'Paige Turner',
    hits: '15',
    desc: 'Java is an object-oriented programming language. Sun Microsystems first released Java in the year 1995. It is popularly used for developing Java applications in data centers, laptops, cell phones, game consoles, and scientific supercomputers. There are multiple websites and applications which will not work if Java is not installed.',
  },
  {
    id: 2,
    img: 'assets/images/faq/2.jpg',
    date: '10',
    month: 'March 2024',
    title: 'Web Development',
    by: ' Petey Cruiser',
    hits: '34',
    desc: 'Web development is the work involved in developing a website for the Internet or an intranet (a private network).Web development can range from developing a simple single static page of plain text to complex web applications, electronic businesses, and social network services, and many more such applications and websites are being created every day.',
  },
];

export const learningData = [
  {
    id: 1,
    img: 'assets/images/faq/3.jpg',
    title: 'Web Devlopment.',
    desc: 'This course is designed to start you on a path toward future studies in web development and design.',
  },
  {
    id: 2,
    img: 'assets/images/faq/1.jpg',
    title: 'Web Design.',
    desc: 'A Web Designing course belongs to the field of Computer Science and IT. It enables students to learn',
  },
  {
    id: 3,
    img: 'assets/images/faq/4.jpg',
    title: 'UX Development.',
    desc: 'User interface design (UI) is the design for machines and software, such as mobile devices, computers.',
  },
  {
    id: 4,
    img: 'assets/images/faq/2.jpg',
    title: 'Spoken English',
    desc: 'Spoken English Courses are pursued by candidates from all levels to improve their communication skills.',
  },
  {
    id: 5,
    img: 'assets/images/faq/4.jpg',
    title: 'Web Devlopment.',
    desc: 'This course is designed to start you on a path toward future studies in web development and design.',
  },
  {
    id: 6,
    img: 'assets/images/faq/3.jpg',
    title: 'Advance Design.',
    desc: 'A Web Development course belongs to the field of Computer Science and IT. It enables students to learn',
  },
];

export const commentsData: comments[] = [
  {
    img: 'assets/images/blog/comment.jpg',
    name: 'Jolio Mark',
    designation: '( Designer )',
    hits: '02',
    comments: 598,
    desc: 'The best thing is location and drive through the forest. The resort is 35km from Ramnagar. The gardens are well kept and maintained. Its a good place for relaxation away from the city noise. The staff is very friendly and overall we had a really good & fun time, thanks to staff member - Bhairav, Rajat, Gunanand, Lokesh & everyone else. And also we went for an adventurous night safari and saw barking deers, tuskar elephant.',
    reply: false,
  },
  {
    img: 'assets/images/blog/9.jpg',
    name: 'Jolio Mark',
    designation: '( Designer )',
    hits: '',
    comments: 398,
    desc: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.",
    reply: true,
  },
  {
    img: 'assets/images/blog/4.jpg',
    name: 'Jolio Mark',
    designation: '( Designer )',
    hits: '02',
    comments: 598,
    desc: 'Clean resort with maintained garden but rooms are average Lack of communication between the staff members. Receptionsit full of attitude. Arrogant staff. Except good view there is nothing great in this property.Resort is 35 kms away from Ramnagar Town.',
    reply: false,
  },
];
