export interface tasks {
  title_id: number;
  status: boolean;
  title: string;
  data: data[];
}

export interface data {
  id: number;
  title: string;
  description: string;
  collection: string;
}

export interface select {
  id: number;
  title: string;
  collection: string;
  description: string;
}

export const view: tasks[] = [
  {
    title_id: 1,
    title: 'Created By Me',
    status: true,
    data: [
      {
        id: 1,
        title: 'Documentation',
        collection: 'General',
        description:
          'Documentation that is used to explain regarding some attributes of an object.',
      },
      {
        id: 2,
        title: 'Kanban design',
        collection: 'General',
        description:
          'kanban board is one of the tools that can be used to implement kanban to manage.',
      },
      {
        id: 3,
        title: 'User profile',
        description: 'There is some Console error in user profile page.',
        collection: 'General',
      },
      {
        id: 4,
        title: 'Set Up',
        description: 'Clone the theme test data file from the GitHub repository.',
        collection: 'General',
      },
      {
        id: 5,
        title: 'Client meeting',
        description:
          'Documentation that is used to explain regarding some attributes of an object to the client.',
        collection: 'General',
      },

      {
        id: 6,
        title: 'Publish podcast',
        description:
          'Digital News Report shows that podcasting is now a worldwide that has become one of the hottest topic.',
        collection: 'General',
      },
      {
        id: 7,
        title: 'Testing',
        description:
          'There are many tools available for testing websites, we’ve chosen classics: Chrome dev tools.',
        collection: 'General',
      },
      {
        id: 8,
        title: 'Email newsletter',
        description: 'There is some Console error in user profile page.',
        collection: 'General',
      },
    ],
  },
  {
    title_id: 2,
    status: false,
    title: "Today's Tasks",
    data: [],
  },
  {
    title_id: 3,
    status: false,
    title: 'Delayed Tasks',
    data: [],
  },
  {
    title_id: 4,
    status: false,
    title: 'Upcoming Tasks',
    data: [],
  },
  {
    title_id: 5,
    status: false,
    title: 'This Week Tasks',
    data: [],
  },
  {
    title_id: 6,
    status: false,
    title: 'This Month Tasks',
    data: [],
  },
  {
    title_id: 7,
    title: 'Assigned To Me',
    status: false,
    data: [
      {
        id: 1,
        title: 'Task name',
        collection: 'General    ',
        description:
          'Documentation that is used to explain regarding some attributes of an object.',
      },
      {
        id: 2,
        title: 'Task name',
        collection: 'General',
        description:
          'There are many tools available for testing websites, we’ve chosen classics: Chrome dev tools.',
      },
      {
        id: 3,
        title: 'Task name',
        description: 'Clone the theme test data file from the GitHub repository.',
        collection: 'General',
      },
      {
        id: 4,
        title: 'Task name',
        description: 'There is some Console error in user profile page.',
        collection: 'General',
      },
      {
        id: 5,
        title: 'Task name ',
        description:
          'kanban board is one of the tools that can be used to implement kanban to manage.',
        collection: 'General',
      },
    ],
  },
  {
    title_id: 8,
    title: 'My Tasks',
    status: false,
    data: [
      {
        id: 1,
        title: 'Task name',
        collection: 'General',
        description:
          'kanban board is one of the tools that can be used to implement kanban to manage.',
      },
      {
        id: 2,
        title: 'Task name',
        collection: 'General',
        description:
          'There are many tools available for testing websites, we’ve chosen classics: Chrome dev tools.',
      },
      {
        id: 3,
        title: 'Task name',
        description: 'Clone the theme test data file from the GitHub repository.',
        collection: 'General',
      },
      {
        id: 4,
        title: 'Task name',
        description:
          'Documentation that is used to explain regarding some attributes of an object.',
        collection: 'General',
      },
      {
        id: 5,
        title: 'Task name',
        description: 'There is some Console error in user profile page.',
        collection: 'General',
      },
    ],
  },
];

export const tasks: tasks[] = [
  {
    title_id: 9,
    status: false,
    title: 'Notification',
    data: [],
  },
  {
    title_id: 10,
    status: false,
    title: 'Newsletter',
    data: [],
  },
  {
    title_id: 11,
    status: false,
    title: 'Business',
    data: [],
  },
  {
    title_id: 12,
    status: false,
    title: 'Holidays',
    data: [],
  },
];
