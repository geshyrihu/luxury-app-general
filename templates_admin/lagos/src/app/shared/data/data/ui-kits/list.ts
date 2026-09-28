export interface commanListData {
  id: number;
  title: string;
  subTitle: string;
  class?: string;
  data: listData[];
}

export interface listData {
  name: string;
  class?: string;
}

export const commanList: commanListData[] = [
  {
    id: 1,
    title: 'Default Lists',
    subTitle:
      'Use the <code>.list-group </code>define the list of items. and used <code>.list-group-item </code>to indicate the current content.',
    data: [
      {
        name: 'Logo Design',
      },
      {
        name: 'Web Design & Development',
      },
      {
        name: 'E-Commerce',
      },
      {
        name: 'SEO',
      },
    ],
  },
  {
    id: 2,
    title: 'Active Lists',
    subTitle:
      'Use<code>.active </code>to a<code>.list-group-item</code> to indicate the current active.',
    data: [
      {
        name: 'UI Kits',
        class: 'active bg-warning-light',
      },
      {
        name: 'Wow Animations',
      },
      {
        name: 'Apex Charts',
      },
      {
        name: 'Starter Kits',
      },
    ],
  },
  {
    id: 2,
    title: 'Flush lists',
    subTitle:
      'Use <code> .list-group-flush</code> to remove some borders and rounded corners to render list group items.',
    class: 'list-group-flush',
    data: [
      {
        name: 'PRODUCT',
        class: 'bg-warning-light',
      },
      {
        name: 'PRODUCT DETAILS',
      },
      {
        name: 'CART',
      },
      {
        name: 'CHECKOUT',
      },
    ],
  },
];

export const contextualClassListData = [
  { colorClass: 'primary' },
  { colorClass: 'secondary' },
  { colorClass: 'success' },
  { colorClass: 'danger' },
  { colorClass: 'warning' },
  { colorClass: 'info' },
  { colorClass: 'white' },
  { colorClass: 'dark' },
];

export const horizontialListData = [
  {
    borderColor: 'primary',
    data: [
      {
        item: 'Product',
        border: true,
      },
      {
        item: 'Product details',
        border: false,
      },
      {
        item: 'Pricing',
        border: false,
      },
      {
        item: 'Payment details',
        border: false,
      },
      {
        item: 'Checkout',
        border: false,
      },
      {
        item: 'Mega options',
        border: false,
      },
    ],
  },
  {
    borderColor: 'secondary',
    data: [
      {
        item: 'Basic table',
        border: true,
      },
      {
        item: 'Sizing table',
        border: false,
      },
      {
        item: 'Border table',
        border: false,
      },
      {
        item: 'Basic inputs',
        border: false,
      },
      {
        item: 'Form validations',
        border: false,
      },
    ],
  },
  {
    borderColor: 'warning',
    data: [
      {
        item: 'Flat style',
        border: true,
      },
      {
        item: 'Edge style',
        border: false,
      },
      {
        item: 'Button group',
        border: false,
      },
      {
        item: 'Rating',
        border: false,
      },
      {
        item: 'Crypto',
        border: false,
      },
    ],
  },
  {
    borderColor: 'success',
    data: [
      {
        item: 'Blog',
        border: true,
      },
      {
        item: 'Blog details',
        border: false,
      },
      {
        item: 'Blog single',
        border: false,
      },
      {
        item: 'Order history',
        border: false,
      },
    ],
  },
  {
    borderColor: 'info',
    data: [
      {
        item: 'Gallery grid',
        border: true,
      },
      {
        item: 'Gallery desc',
        border: false,
      },
      {
        item: 'Masonry Desc',
        border: false,
      },
    ],
  },
];

export const customContentData = [
  {
    class: 'active bg-primary',
    img: 'assets/images/user/1.jpg',
    name: 'Molly Boake',
    email: 'MollyBoake@rhyta.com',
    time: '5 days ago',
    desc: 'Next step is to choose a tone of voice for your content type. From casual to convincing, pick one from 20+ tones in the dropdown.Why did we say “snag eyeballs” instead of “get attention?” Why do we say “brick-and-mortar words” instead of “concrete words?” Because, in your email subject lines, it’s better to use words that people can picture.',
    followers: '20K Followers',
  },
  {
    class: 'list-hover-primary',
    img: 'assets/images/user/3.png',
    name: 'Gabrielle Fahey',
    email: 'GabrielleFahey@dayrep.com',
    time: '10 days ago',
    desc: "Your aim with this blog is to advertise yourself and your services in blog design. That means it's vital to create content about just that: blog design. Anything else on your page may act as a distraction to your potential customers, and you don't want that!",
    followers: '100 Followers',
  },
  {
    class: 'list-hover-primary',
    img: 'assets/images/user/2.jpg',
    name: 'Lucinda Moseley',
    email: 'LucindaMoseley@teleworm.us',
    time: '3 days ago',
    desc: 'People who are looking to hire a web designer may not know what to look out for. This will give you a chance to prove your trustworthiness by providing potential customers with advice and will let you sell your services by highlighting their best qualities.',
    followers: '23M Followers',
  },
];

export const scrollableListData = [
  {
    class: 'active list-hover-primary',
    img: 'assets/images/user/9.jpg',
    name: 'Molly Boake',
    email: 'MollyBoake@rhyta.com',
    time: '5 days ago',
  },
  {
    class: 'list-hover-primary',
    img: 'assets/images/user/10.jpg',
    name: 'Gabrielle Fahey',
    email: 'GabrielleFahey@dayrep.com',
    time: '10 days ago',
  },
  {
    class: 'list-hover-primary',
    img: 'assets/images/user/2.jpg',
    name: 'Lucinda Moseley',
    email: 'LucindaMoseley@teleworm.us',
    time: '3 days ago',
  },
  {
    class: 'list-hover-primary',
    img: 'assets/images/user/12.png',
    name: 'Francis K. Henriques',
    email: 'FrancisKHenriques@teleworm.us',
    time: '2 days ago',
  },
  {
    class: 'list-hover-primary',
    img: 'assets/images/user/14.png',
    name: 'Jose A. Seay',
    email: 'JoseASeay@rhyta.com',
    time: '15 days ago',
  },
  {
    class: 'list-hover-primary',
    img: 'assets/images/user/3.jpg',
    name: 'Phil F. Cunningham',
    email: 'PhilFCunningham@dayrep.com',
    time: '6 days ago',
  },
  {
    class: 'list-hover-primary',
    img: 'assets/images/user/7.jpg',
    name: 'Richard E. Johnson',
    email: 'RichardEJohnson@teleworm.us',
    time: '20 days ago',
  },
  {
    class: 'list-hover-primary',
    img: 'assets/images/user/2.png',
    name: 'Lawrence L. Nash',
    email: 'LawrenceLNash@jourrapide.com',
    time: '8 days ago',
  },
];

export const chechBox = [
  {
    id: 'firstCheckbox',
    color: 'primary',
    title: 'Auto Start',
  },
  {
    id: 'secondCheckbox',
    color: 'secondary',
    title: 'Auto Update',
  },
  {
    id: 'thirdCheckbox',
    color: 'success',
    title: "Don't check auth key",
  },
  {
    id: 'fourCheckbox',
    color: 'warning',
    title: 'Success all',
  },
];

export const disable = [
  {
    class: 'list-hover-primary active',
    image: 'assets/images/user/1.jpg',
    name: 'Teresa J. Mosteller',
  },
  {
    class: 'list-hover-primary',
    image: 'assets/images/user/3.png',
    name: 'Gloria D. Acheson',
  },
  {
    class: 'disabled',
    image: 'assets/images/user/2.jpg',
    name: 'Sharon C. Obrien',
  },
  {
    class: 'disabled',
    image: 'assets/images/user/5.jpg',
    name: 'Bryan A. Owens',
  },
];

export const NumberedBadgeList = [
  {
    class: 'warning',
    tag: 'Freelance',
    textColor: '',
    name: 'Stella Nowland',
  },
  {
    class: 'danger',
    tag: 'Issue',
    textColor: 'text-white',
    name: 'Lola Stanford',
  },
  {
    class: 'primary',
    tag: 'Social',
    textColor: 'text-white',
    name: 'Caitlin Coungeau',
  },
  {
    class: 'danger',
    tag: 'Issue',
    textColor: 'text-white',
    name: 'Graciela W. McClaran',
  },
];

export const radio = [
  {
    color: 'danger',
    id: 'firstRadio',
    active: true,
    name: 'Meditations',
  },
  {
    color: 'primary',
    id: 'secondRadio',
    active: false,
    name: 'Read a book',
  },
  {
    color: 'success',
    id: 'thirdRadio',
    active: false,
    name: 'Learn to code',
  },
  {
    color: 'info',
    id: 'fourRadio',
    active: false,
    name: 'Drink more water',
  },
];
