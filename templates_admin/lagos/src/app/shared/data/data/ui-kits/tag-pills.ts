export interface commonTagPills {
  id: number;
  header: string;
  desc: string;
  data: data[];
}

export interface data {
  class: string;
  text?: string;
  icon?: string;
}

export const commonTagPillsData: commonTagPills[] = [
  {
    id: 1,
    header: 'Badges contextual variations',
    desc: 'Use the<code>.badge </code>utility class to make more badges.',
    data: [
      {
        class: 'badge badge-primary',
        text: 'Primary',
      },
      {
        class: 'badge badge-secondary',
        text: 'Secondary',
      },
      {
        class: 'badge badge-success',
        text: 'Success',
      },
      {
        class: 'badge badge-info',
        text: 'Info',
      },
      {
        class: 'badge badge-warning',
        text: 'Warning',
      },
      {
        class: 'badge badge-danger',
        text: 'Danger',
      },
      {
        class: 'badge badge-light text-dark',
        text: 'Light',
      },
      {
        class: 'badge badge-dark tag-pills-sm-mb',
        text: 'Dark',
      },
    ],
  },
  {
    id: 2,
    header: 'Pills Contextual Variations',
    desc: 'Use the <code>.rounded-pill</code> utility class to make badges more rounded with a larger <code>border-radius</code>.',
    data: [
      {
        class: 'badge rounded-pill badge-primary',
        text: 'Primary',
      },
      {
        class: 'badge rounded-pill badge-secondary',
        text: 'Secondary',
      },
      {
        class: 'badge rounded-pill badge-success',
        text: 'Success',
      },
      {
        class: 'badge rounded-pill badge-info',
        text: 'Info',
      },
      {
        class: 'badge rounded-pill badge-warning',
        text: 'Warning',
      },
      {
        class: 'badge rounded-pill badge-danger',
        text: 'Danger',
      },
      {
        class: 'badge rounded-pill badge-light text-dark',
        text: 'Light',
      },
      {
        class: 'badge rounded-pill badge-dark  tag-pills-sm-mb',
        text: 'Dark',
      },
    ],
  },
  {
    id: 3,
    header: 'Number of Badge',
    desc: 'Use the <code>.badge</code> utility class to make number of more badges.',
    data: [
      {
        class: 'badge badge-primary',
        text: '1',
      },
      {
        class: 'badge badge-secondary',
        text: '2',
      },
      {
        class: 'badge badge-success',
        text: '3',
      },
      {
        class: 'badge badge-info',
        text: '4',
      },
      {
        class: 'badge badge-warning',
        text: '5',
      },
      {
        class: 'badge badge-danger',
        text: '6',
      },
      {
        class: 'badge badge-light text-dark',
        text: '7',
      },
      {
        class: 'badge badge-dark',
        text: '8',
      },
    ],
  },
  {
    id: 4,
    header: 'Number of Pills Tags',
    desc: 'Use the <code>.rounded-circle</code> utility class to make badges more rounded with a larger <code>border-radius</code>.',
    data: [
      {
        class: 'badge rounded-circle badge-p-space badge-primary',
        text: '1',
      },
      {
        class: 'badge rounded-circle badge-p-space badge-secondary',
        text: '2',
      },
      {
        class: 'badge rounded-circle badge-p-space badge-success',
        text: '3',
      },
      {
        class: 'badge rounded-circle badge-p-space badge-info',
        text: '4',
      },
      {
        class: 'badge rounded-circle badge-p-space badge-warning',
        text: '5',
      },
      {
        class: 'badge rounded-circle badge-p-space badge-danger',
        text: '6',
      },
      {
        class: 'badge rounded-circle badge-p-space badge-light text-dark',
        text: '7',
      },
      {
        class: 'badge rounded-circle badge-p-space badge-dark',
        text: '8',
      },
    ],
  },
  {
    id: 5,
    header: 'Badge Tags With Icons',
    desc: 'Use the <code>.badge </code>utility class to make more icons.',
    data: [
      {
        class: 'badge b-ln-height badge-primary',
        icon: 'dollar-sign',
      },
      {
        class: 'badge b-ln-height badge-secondary',
        icon: 'headphones',
      },
      {
        class: 'badge b-ln-height badge-success',
        icon: 'link',
      },
      {
        class: 'badge b-ln-height badge-info',
        icon: 'github',
      },
      {
        class: 'badge b-ln-height badge-warning',
        icon: 'award',
      },
      {
        class: 'badge b-ln-height badge-danger',
        icon: 'activity',
      },
      {
        class: 'badge b-ln-height badge-light text-dark',
        icon: 'heart',
      },
      {
        class: 'badge b-ln-height badge-dark',
        icon: 'mail',
      },
    ],
  },
  {
    id: 6,
    header: 'Rounded Pills With Icons',
    desc: 'Use the <code>.rounded-pill</code> utility class to make icons badges more rounded with a larger <code>border-radius</code>.',
    data: [
      {
        class: 'badge rounded-circle p-2 badge-primary',
        icon: 'dollar-sign',
      },
      {
        class: 'badge rounded-circle p-2 badge-secondary',
        icon: 'headphones',
      },
      {
        class: 'badge rounded-circle p-2 badge-success',
        icon: 'link',
      },
      {
        class: 'badge rounded-circle p-2 badge-info',
        icon: 'github',
      },
      {
        class: 'badge rounded-circle p-2 badge-warning',
        icon: 'award',
      },
      {
        class: 'badge rounded-circle p-2 badge-danger',
        icon: 'activity',
      },
      {
        class: 'badge rounded-circle p-2 badge-light text-dark',
        icon: 'heart',
      },
      {
        class: 'badge rounded-circle p-2 badge-dark tag-pills-sm-mb',
        icon: 'mail',
      },
    ],
  },
];

export const badgeButtonData = [
  {
    text: 'Messages',
    colorClass: 'primary',
    icon: 'mail',
  },
  {
    text: 'Notifications',
    colorClass: 'secondary',
    icon: 'bell',
  },
  {
    text: 'Update available',
    colorClass: 'success',
    icon: 'settings',
  },
  {
    text: 'Playing Now',
    colorClass: 'info',
    icon: 'music',
  },
  {
    text: '1.2 GB Used',
    colorClass: 'warning',
    icon: 'alert-triangle',
  },
];
