export interface knowledgebase {
  title: string;
  class: string;
  desc: string;
  ican: string;
}

export interface featuredTutorial {
  id: number;
  rating: number;
  img: string;
  post: string;
  desc: string;
  date: string;
}

export interface articlesAndVideos {
  row: number;
  class: string;
  data: data[];
}

export interface data {
  id: number;
  icon: string;
  title: string;
  desc: string;
  class: string;
}

export const knowledgebaseData: knowledgebase[] = [
  {
    title: 'Articles',
    class: 'col-xl-4 col-md-6',
    desc: 'How little experience or technical knowledge you currently have. The web is a very big place, and if you are the typical internet user, you visit websites every day.',
    ican: 'book-open',
  },
  {
    title: 'Knowledgebase',
    class: 'col-xl-4 col-md-6',
    desc: 'A Website Designing course enables learners to use essential designing and programming in tools required to do the job. The curriculum is a blend of various themes.',
    ican: 'aperture',
  },
  {
    title: 'Support',
    class: 'col-xl-4',
    desc: 'The customer support industry is renaissance. Customer support as a specialty is coming into its own, offering companies competitive advantage that’s difficult to copy.',
    ican: 'file-text',
  },
];

export const featuredTutorialData: featuredTutorial[] = [
  {
    id: 1,
    rating: 5,
    img: 'assets/images/faq/1.jpg',
    post: 'Web Design',
    desc: 'A Web Designing course belongs to the field of Computer Science and IT. It enables students to learn',
    date: 'Dec 15, 2024',
  },
  {
    id: 2,
    rating: 4,
    img: 'assets/images/faq/2.jpg',
    post: 'Web Development',
    desc: 'This course is designed to start you on a path toward future studies in web development and design.',
    date: 'Dec 15, 2024',
  },
  {
    id: 3,
    rating: 5,
    img: 'assets/images/faq/3.jpg',
    post: 'UI Design',
    desc: 'User interface design (UI) is the design for machines and software, such as mobile devices, computers.',
    date: 'Dec 15, 2024',
  },
  {
    id: 4,
    rating: 4.5,
    img: 'assets/images/faq/4.jpg',
    post: 'UX Design',
    desc: 'A Web Designing course belongs to the field of Computer Science and IT. It enables students to learn',
    date: 'Dec 15, 2024',
  },
];

export const articlesAndVideosData: articlesAndVideos[] = [
  {
    row: 1,
    class: 'col-xl-4 col-md-6',
    data: [
      {
        id: 1,
        icon: 'codepen',
        title: 'Using Video',
        desc: 'Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus.',
        class: 'col-sm-12',
      },
      {
        id: 2,
        title: 'Vel illum qu',
        icon: 'codepen',
        desc: 'Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus.',
        class: 'col-sm-12',
      },
      {
        id: 3,
        title: 'Cum sociis natoqu',
        icon: 'codepen',
        desc: 'Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus.',
        class: 'col-sm-12',
      },
    ],
  },
  {
    row: 2,
    class: 'col-xl-4 col-md-6',
    data: [
      {
        id: 4,
        title: 'Donec pede justo',
        icon: 'file-text',
        desc: 'Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus.',
        class: 'col-sm-12',
      },
      {
        id: 5,
        title: 'Nam quam nunc',
        icon: 'file-text',
        desc: 'Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus.',
        class: 'col-sm-12',
      },
      {
        id: 6,
        title: 'Using Video',
        icon: 'file-text',
        desc: 'Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus.',
        class: 'col-sm-12',
      },
    ],
  },
  {
    row: 3,
    class: 'col-xl-4',
    data: [
      {
        id: 7,
        title: 'Vel illum qu',
        icon: 'youtube',
        desc: 'Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus.',
        class: 'col-xl-12 col-md-6',
      },
      {
        id: 8,
        title: 'Cum sociis natoqu',
        icon: 'youtube',
        desc: 'Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus.',
        class: 'col-xl-12 col-md-6',
      },
      {
        id: 9,
        title: 'Donec pede justo',
        icon: 'youtube',
        desc: 'Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus.',
        class: 'col-xl-12',
      },
    ],
  },
];

export const browseArticlesData = [
  {
    colClass: 'col-xl-4 xl-50 col-md-6',
    seeMore: 40,
    title: 'Quick Questions are answered',
    titleIcon: 'archive',
    data: [
      {
        listData: 'Policies have wide acceptance editors.',
        dataIcon: 'file-text',
        tag: false,
        tagTitle: '',
      },
      {
        listData: 'Guidelines are sets of best practices supported.',
        dataIcon: 'file-text',
        tag: false,
        tagTitle: '',
      },
      {
        listData: 'Editors should attempt to follow guidelines.',
        dataIcon: 'file-text',
        tag: true,
        tagTitle: 'New',
      },
      {
        listData: 'They are best treated with common sense.',
        dataIcon: 'file-text',
        tag: false,
        tagTitle: '',
      },
    ],
  },
  {
    colClass: 'col-xl-4 xl-50 col-md-6',
    seeMore: 90,
    title: ' API allows search and download AP Images.',
    titleIcon: 'archive',
    data: [
      {
        listData: 'API retrieve breaking news categories.',
        dataIcon: 'file-text',
        tag: true,
        tagTitle: 'Review',
      },
      {
        listData: 'API retrieves rules for fantasy league.',
        dataIcon: 'file-text',
        tag: false,
        tagTitle: '',
      },
      {
        listData: 'Resource API retrieves content produced business.',
        dataIcon: 'file-text',
        tag: true,
        tagTitle: 'Articles',
      },
      {
        listData: 'Making this the first true generator on the Internet.',
        dataIcon: 'file-text',
        tag: false,
        tagTitle: '',
      },
    ],
  },
  {
    colClass: 'col-xl-4 xl-50 col-md-6',
    seeMore: 50,
    title: 'WordPress Site Maintenance',
    titleIcon: 'archive',
    data: [
      {
        listData: 'Make a backup of your WordPress website.',
        dataIcon: 'file-text',
        tag: false,
        tagTitle: '',
      },
      {
        listData: 'Run a Wordpress security Website check.',
        dataIcon: 'file-text',
        tag: true,
        tagTitle: 'Closed',
      },
      {
        listData: 'Monitor your search engine optimization.',
        dataIcon: 'file-text',
        tag: false,
        tagTitle: '',
      },
      {
        listData: 'Set a regular maintenance schedule.',
        dataIcon: 'file-text',
        tag: false,
        tagTitle: '',
      },
    ],
  },
  {
    colClass: 'col-xl-4 xl-50 col-md-6',
    seeMore: 90,
    title: 'Meta Tags in WordPress',
    titleIcon: 'archive',
    data: [
      {
        listData: 'When an unknown printer took a galley',
        dataIcon: 'file-text',
        tag: true,
        tagTitle: 'Popular',
      },
      {
        listData: 'You can easily change plans at any time.',
        dataIcon: 'file-text',
        tag: false,
        tagTitle: '',
      },
      {
        listData: 'you’ll be charged a prorated cover that upgrade.',
        dataIcon: 'file-text',
        tag: false,
        tagTitle: '',
      },
      {
        listData: 'But also the leap into electronic typesetting,',
        dataIcon: 'file-text',
        tag: false,
        tagTitle: '',
      },
    ],
  },
  {
    colClass: 'col-xl-4 xl-50 col-md-6',
    seeMore: 50,
    title: 'WordPress in Your Language',
    titleIcon: 'archive',
    data: [
      {
        listData: 'Premium plans are billed as a single yearly payment.',
        dataIcon: 'file-text',
        tag: false,
        tagTitle: '',
      },
      {
        listData: 'Monthly plan are bill every month of signup.',
        dataIcon: 'file-text',
        tag: false,
        tagTitle: '',
      },
      {
        listData: 'You can set Monthly or Yearly for Premium plan.',
        dataIcon: 'file-text',
        tag: false,
        tagTitle: '',
      },
      {
        listData: 'unknown printer took galley.',
        dataIcon: 'file-text',
        tag: true,
        tagTitle: 'Closed',
      },
    ],
  },
  {
    colClass: 'col-xl-4 xl-50 col-md-6',
    seeMore: 26,
    title: 'Know Your Sources',
    titleIcon: 'archive',
    data: [
      {
        listData: 'Many new editors rely on policy interpretations.',
        dataIcon: 'file-text',
        tag: false,
        tagTitle: '',
      },
      {
        listData: 'Editor continually attempts to find a different policy.',
        dataIcon: 'file-text',
        tag: false,
        tagTitle: '',
      },
      {
        listData: 'Violation of maintaining a neutral point of view.',
        dataIcon: 'file-text',
        tag: true,
        tagTitle: 'Article',
      },
      {
        listData: 'You double check your sources.',
        dataIcon: 'file-text',
        tag: false,
        tagTitle: '',
      },
    ],
  },
  {
    colClass: 'col-xl-4 xl-50 col-md-6',
    seeMore: 10,
    title: 'Validating a Website',
    titleIcon: 'archive',
    data: [
      {
        listData: 'You can modify some specific component settings.',
        dataIcon: 'file-text',
        tag: true,
        tagTitle: 'Review',
      },
      {
        listData: 'Click Apply to validate the set preferences.',
        dataIcon: 'file-text',
        tag: false,
        tagTitle: '',
      },
      {
        listData: 'Following procedure apply the components',
        dataIcon: 'file-text',
        tag: true,
        tagTitle: 'Closed',
      },
      {
        listData: 'To modify those specific components settings.',
        dataIcon: 'file-text',
        tag: false,
        tagTitle: '',
      },
    ],
  },
  {
    colClass: 'col-xl-4 xl-50 col-md-6',
    seeMore: 21,
    title: 'Quick Questions are answered',
    titleIcon: 'archive',
    data: [
      {
        listData: 'To get started with your account.',
        dataIcon: 'file-text',
        tag: false,
        tagTitle: '',
      },
      {
        listData: 'Compile your theme using gulp',
        dataIcon: 'file-text',
        tag: true,
        tagTitle: 'Popular',
      },
      {
        listData: 'Users can browse by topic or use the visually.',
        dataIcon: 'file-text',
        tag: true,
        tagTitle: 'Review',
      },
      {
        listData: 'This works through various methods of site tracking',
        dataIcon: 'file-text',
        tag: false,
        tagTitle: '',
      },
    ],
  },
  {
    colClass: 'col-xl-4 xl-100',
    seeMore: 34,
    title: 'Integrating WordPress with Your Website',
    titleIcon: 'archive',
    data: [
      {
        listData: 'Language regular existing languages.',
        dataIcon: 'file-text',
        tag: false,
        tagTitle: '',
      },
      {
        listData: 'The first line of Lorem Ipsum,  Lorem ipsum',
        dataIcon: 'file-text',
        tag: false,
        tagTitle: '',
      },
      {
        listData: 'Thus comes from a line in section',
        dataIcon: 'file-text',
        tag: false,
        tagTitle: '',
      },
      {
        listData: 'First true generator on the Internet',
        dataIcon: 'file-text',
        tag: true,
        tagTitle: 'On hold',
      },
    ],
  },
];
