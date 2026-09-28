export interface comments {
  img: string;
  name: string;
  designation: string;
  hits: string;
  comments: number;
  desc: string;
  reply: boolean;
}
export interface blogGrid {
  image: string;
  profileImage: string;
  userName: string;
  date: string;
  title: string;
  desc: string;
  view: number;
  like: boolean;
}

export const blogGrids: blogGrid[] = [
  {
    image: 'assets/images/blog/grid-1.jpg',
    profileImage: 'assets/images/blog/about/1.png',
    userName: 'Erin M. Baker',
    date: 'Feb 6,2024',
    title: 'Mobile App Development',
    desc: 'Mobile Simple log in – logging in to your website is easyThey have added a dedicated login page inside the app.',
    view: 8,
    like: false,
  },
  {
    image: 'assets/images/blog/grid-2.jpg',
    profileImage: 'assets/images/blog/about/2.png',
    userName: 'Amy A. Servants',
    date: 'Feb 2,2024',
    title: 'Publish Policy',
    desc: 'The new rules classify companies with more than 45 million users as very.The laptop visible with some text and icons on it.',
    view: 2,
    like: false,
  },
  {
    image: 'assets/images/blog/grid-3.jpg',
    profileImage: 'assets/images/blog/about/3.png',
    userName: 'Jackie M. Martin',
    date: 'Feb 9,2024',
    title: 'Cozy Workspace',
    desc: 'The image is designed to convey a sense of comfort and warmth, as seen from the soft lighting and the cozy wooden.',
    view: 12,
    like: false,
  },
  {
    image: 'assets/images/blog/grid-4.jpg',
    profileImage: 'assets/images/blog/about/4.png',
    userName: 'Mary S. Jelks',
    date: 'Jan 25,2024',
    title: 'Take the stress out of code',
    desc: 'Are you wondering how to get a text short code and get start with reaching your customers in new SMS into steps.',
    view: 5,
    like: false,
  },
  {
    image: 'assets/images/blog/grid-5.jpg',
    profileImage: 'assets/images/blog/about/5.png',
    userName: 'Kathe W. Williams',
    date: 'Jan 5,2024',
    title: 'Myths about code',
    desc: "All of the paragraphs in the are written by humans. thought about to generate the paragraph, but they weren't very.",
    view: 4,
    like: false,
  },
  {
    image: 'assets/images/blog/grid-6.jpg',
    profileImage: 'assets/images/blog/about/6.png',
    userName: 'Anna G. Proas',
    date: 'Dec 31, 2024',
    title: 'Old School Coded',
    desc: 'Particular I learned about our mental and physical limits,the nature of stress and anxiety, and most importantly.',
    view: 11,
    like: false,
  },
];

export const latestNewsAndTrends = [
  {
    title: 'Top Men’s Fashion Trends From Spring',
    desc: 'Offer budget-friendly alternatives and shopping tips for men who want to stay on-trend without breaking the bank, such as shopping at thrift stores or opting for affordable brands.',
    date: '25 May 2024',
    comment: 10,
  },
  {
    title: 'Spicy Crispy Chicken Burger Recipe',
    desc: 'Share tips for meal prepping burger components ahead of time, such as preparing the chicken patties in advance or making extra sauce for later use, provide tips for the perfect crispy chicken.',
    date: '15 July 2024',
    comment: 11,
  },
  {
    title: 'Headsets Are Better if You’re Playing Game',
    desc: 'Explain how headsets with surround sound capabilities improve spatial awareness in games, allowing players to pinpoint the direction of in-game sounds such as footsteps or gunfire.',
    date: '14 June 2024',
    comment: 18,
  },
  {
    title: 'Mistakes You Might Be Making With Watch',
    desc: 'Overwinding mechanical watches can cause serious damage to the movement. Content could explain how to properly wind mechanical watches and recognize when they are fully wound.',
    date: '10 April 2024',
    comment: 15,
  },
];

export const trendingPosts = [
  {
    id: '01',
    title: 'Mistakes You Might Be Making With Watch',
    date: 'June 29, 2024',
  },
  {
    id: '02',
    title: 'Top Men’s Fashion Trends From Spring',
    date: 'May 11, 2024',
  },
  {
    id: '04',
    title: 'Surprising Benefits of Honeydew Melon',
    date: 'March 25, 2024',
  },
  {
    id: '01',
    title: 'Spicy Crispy Chicken Burger Recipe',
    date: 'July 17, 2024',
  },
  {
    id: '05',
    title: 'Headsets Are Better if You’re Playing Games',
    date: 'April 22, 2024',
  },
];

export const recentPosts = [
  {
    image: 'assets/images/blog/small/1.jpg',
    title: 'Gadgets That Will Upgrade Your Home',
    time: 4,
  },
  {
    image: 'assets/images/blog/small/2.jpg',
    title: 'Headsets Are Better if You’re Playing Games',
    time: 5,
  },
  {
    image: 'assets/images/blog/small/3.jpg',
    title: 'Laugh, Cry and Learn Within Virtual Reality',
    time: 7,
  },
  {
    image: 'assets/images/blog/small/4.jpg',
    title: 'Mistakes You Might Be Making With Your Watch',
    time: 8,
  },
];

export const popularTags = [
  {
    title: 'Design',
  },
  {
    title: 'Clean',
  },
  {
    title: 'CSS3',
  },
  {
    title: 'Portfolio',
  },
  {
    title: 'Perfect',
  },
  {
    title: 'No Jquery',
  },
];
