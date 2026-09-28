export interface Task {
  text: string;
  completed: boolean;
  priority: string;
  badgeClass: string;
  Date: string;
}

export const task: Task[] = [
  {
    text: 'Check validation involves making sure all your tags are properly closed and nested',
    priority: 'In Progress',
    badgeClass: 'badge-light-primary',
    Date: '10 Nov',
    completed: false,
  },
  {
    text: 'Test the outgoing links from all the pages to the specific domain under test.',
    priority: 'Pending',
    badgeClass: 'badge-light-danger',
    Date: '04 Aug',
    completed: false,
  },
  {
    text: 'Test links are used to send emails to admin or other users from web pages.',
    priority: 'Done',
    badgeClass: 'badge-light-success',
    Date: '25 Feb',
    completed: true,
  },
  {
    text: 'Options to create forms, if any, form deletes a view or modify the forms.',
    priority: 'In Progress',
    badgeClass: 'badge-light-primary',
    Date: '15 Dec',
    completed: false,
  },
  {
    text: 'Wrong inputs in the forms to the fields in the forms.',
    priority: 'Pending',
    badgeClass: 'badge-light-danger',
    Date: '11 Nov',
    completed: false,
  },
  {
    text: 'Check if the instructions provided are perfect to satisfy its purpose.',
    priority: 'Pending',
    badgeClass: 'badge-light-danger',
    Date: '04 Sept',
    completed: true,
  },
  {
    text: 'Application server and Database server interface.',
    priority: 'Done',
    badgeClass: 'badge-light-success',
    Date: '08 July',
    completed: false,
  },
];
