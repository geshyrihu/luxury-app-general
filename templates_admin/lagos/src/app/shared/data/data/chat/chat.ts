export interface contects {
  id: number;
  title: string;
  item: item[];
}

export interface item {
  id: number;
  name: string;
  number: string;
  img?: string;
  text?: string;
  class?: string;
}

export const chat = [
  {
    image: 'assets/images/avtar/3.jpg',
    status: 'success',
    name: 'Cameron Williamson',
    message: 'Hey, How are you?',
    item: '2 min',
    count: 15,
  },
  {
    image: 'assets/images/avtar/11.jpg',
    status: 'success',
    name: 'Esther Howard',
    message: 'Thanks for reply',
    item: '7:30 PM',
  },
  {
    image: 'assets/images/avtar/7.jpg',
    status: 'success',
    name: 'Jane Cooper',
    message: "Hey, What's up?",
    item: '1:10 PM',
  },
  {
    image: 'assets/images/avtar/16.jpg',
    status: 'success',
    name: 'Ronald Richards',
    message: "I'm ready",
    item: '13:10 PM',
  },
  {
    image: 'assets/images/avtar/4.jpg',
    status: 'warning',
    name: 'Darlene Robertson',
    message: 'Hey, How are you?',
    item: '1:30 PM',
  },
  {
    image: 'assets/images/blog/comment.jpg',
    status: 'warning',
    name: 'Darrell Steward',
    message: "What's going on?",
    item: '2:10 PM',
  },
  {
    image: 'assets/images/blog/4.jpg',
    status: 'success',
    name: 'Theresa Webb',
    message: "What's up?",
    item: '1:50 AM',
  },
  {
    image: 'assets/images/blog/12.png',
    status: 'warning',
    name: 'Floyd Miles',
    message: 'Are you sure?',
    item: '5:14 PM',
  },
  {
    image: 'assets/images/blog/9.jpg',
    status: 'warning',
    name: 'Annette Black',
    message: 'Thanks',
    item: '1:50 PM',
  },
];

export const Contacts = [
  {
    id: 1,
    title: 'A',
    item: [
      {
        id: 1,
        name: 'Andres Williamson',
        number: '191-900-5689',
        img: 'assets/images/avtar/3.jpg',
      },
    ],
  },
  {
    id: 2,
    title: 'B',
    item: [
      {
        id: 1,
        name: 'Britlin Weed',
        number: '698-781-5581',
        img: 'assets/images/blog/comment.jpg',
      },
      {
        id: 2,
        name: 'Brendra Dixit',
        number: '589-789-2563',
        text: 'BD',
        class: 'secondary',
      },
    ],
  },
  {
    id: 3,
    title: 'C',
    item: [
      {
        id: 1,
        name: 'Cody Fisher',
        number: '983-333-4545',
        img: 'assets/images/blog/14.png',
      },
      {
        id: 2,
        name: 'Clifford Evans',
        number: '321-456-7878',
        text: 'CE',
        class: 'success',
      },
      {
        id: 3,
        name: 'Cameron Williamson',
        number: '369-852-7417',
        text: 'CW',
        class: 'warning',
      },
    ],
  },
  {
    id: 4,
    title: 'D',
    item: [
      {
        id: 4,
        name: 'Darlene Robertson',
        number: '231-279-1001',
        img: 'assets/images/blog/12.png',
      },
      {
        id: 5,
        name: 'Dianne Russell',
        number: '569-789-1002',
        img: 'assets/images/user/3.png',
      },
      {
        id: 6,
        name: 'Darrell Steward',
        number: '200-300-1030',
        img: 'assets/images/user/6.jpg',
      },
    ],
  },
  {
    id: 5,
    title: 'E',
    item: [
      {
        id: 1,
        name: 'Emily Collins',
        number: '100-555-7032',
        img: 'assets/images/user/1.jpg',
      },
    ],
  },
  {
    id: 6,
    title: 'F',
    item: [
      {
        id: 2,
        name: 'Fiona Cooper',
        number: '362-778-1919',
        img: 'assets/images/user/2.jpg',
      },
      {
        id: 3,
        name: 'Freya Grayson',
        number: '589-789-2563',
        text: 'FG',
        class: 'danger',
      },
    ],
  },
  {
    id: 7,
    title: 'G',
    item: [
      {
        id: 1,
        name: 'Gabriel Evans',
        number: '963-147-5024',
        text: 'GE',
        class: 'warning',
      },
    ],
  },
];

export const massage = [
  {
    name: 'Theresa Webb',
    time: '01:14 PM',
    text: "Hey, I'm looking to redesign my website. Can you help me?",
    side: ' left',
  },
  {
    name: 'Darrell Steward',
    time: '12:14 PM',
    text: "Absolutely! I'd be happy to assist you.",
    side: 'right',
  },
  {
    name: 'Darrell Steward',
    time: '12:14 PM',
    text: 'What kind of design aesthetic are you aiming for?',
    side: 'right',
  },
  {
    name: 'Theresa Webb',
    time: '01:14 PM',
    text: 'I want a clean and modern look with a focus on user experience.',
    side: ' left',
  },
  {
    name: 'Darrell Steward',
    time: '12:14 PM',
    text: 'Great! Do you have any specific color schemes in mind?',
    side: 'right',
  },
  {
    name: 'Theresa Webb',
    time: '01:14 PM',
    text: "I'm thinking of using a combination of blues and grays.",
    side: ' left',
  },
  {
    name: 'Darrell Steward',
    time: '12:14 PM',
    text: 'Excellent choice! Those colors can definitely create a professional.',
    side: 'right',
  },
];
