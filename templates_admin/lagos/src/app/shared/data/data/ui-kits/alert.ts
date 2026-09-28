export interface commonalert {
  header: string;
  desc: string;
  data1: data[];
  data2: data[];
}

export interface data {
  title: string;
  alertClass: string;
  textClass: string;
}

export interface outLinedAlert {
  class: string;
  textColor: string;
  text: string;
  icon: string;
}

export interface alertIconTextAlert {
  class: string;
  textColor: string;
  text: string;
  icon: string;
  buttonText: string;
}

export const darkThemeAlertData: commonalert[] = [
  {
    header: 'Link Color In Dark Theme',
    desc: 'Use the <code>.alert-link</code> utility class to quickly provide matching colored links within any alert',
    data1: [
      {
        title: 'Primary Alert',
        alertClass: 'primary dark',
        textClass: 'text-white',
      },
      {
        title: 'Secondary Alert',
        alertClass: 'secondary dark',
        textClass: 'text-white',
      },
      {
        title: 'Success Alert',
        alertClass: 'success dark',
        textClass: 'text-white',
      },
      {
        title: 'Info Alert',
        alertClass: 'info dark',
        textClass: 'text-white',
      },
    ],
    data2: [
      {
        title: 'Warning Alert',
        alertClass: 'warning dark',
        textClass: 'text-white',
      },
      {
        title: 'Danger Alert',
        alertClass: 'danger dark',
        textClass: 'text-white',
      },
      {
        title: 'Light Alert',
        alertClass: 'light dark',
        textClass: '',
      },
      {
        title: 'Dark Alert',
        alertClass: 'dark dark',
        textClass: 'text-white',
      },
    ],
  },
];

export const lightThemeAlertData: commonalert[] = [
  {
    header: 'Link Color In Light Theme',
    desc: 'Use the <code>.alert-link</code> utility class to quickly provide matching colored links within any alert',
    data1: [
      {
        title: 'Primary',
        alertClass: 'light-primary',
        textClass: 'txt-primary',
      },
      {
        title: 'Secondary',
        alertClass: 'light-secondary',
        textClass: 'txt-secondary',
      },
      {
        title: 'Success',
        alertClass: 'light-success',
        textClass: 'txt-success',
      },
      {
        title: 'Info',
        alertClass: 'light-info',
        textClass: 'txt-info',
      },
    ],
    data2: [
      {
        title: 'Warning',
        alertClass: 'light-warning',
        textClass: 'txt-warning',
      },
      {
        title: 'Danger',
        alertClass: 'light-danger',
        textClass: 'txt-danger',
      },
      {
        title: 'light',
        alertClass: 'light-light',
        textClass: 'txt-dark',
      },
      {
        title: 'Dark',
        alertClass: 'light-dark',
        textClass: 'txt-dark',
      },
    ],
  },
];

export const outLinedAlertData: outLinedAlert[] = [
  {
    class: '',
    textColor: 'primary',
    text: "One of <strong>YouTube's</strong>most crucial ranking factors is Watch Time.",
    icon: 'clock',
  },
  {
    class: 'outline-2x alert-icons',
    textColor: 'success',
    text: 'Well done! </b>You successfully read this important message.',
    icon: 'thumbs-up',
  },
];

export const alertIconTextAlertData: alertIconTextAlert[] = [
  {
    class: '',
    textColor: 'warning',
    text: 'Your time Over after <strong class="txt-dark">5</strong>  minute',
    icon: 'icon-timer',
    buttonText: 'Check',
  },
  {
    class: 'mb-0',
    textColor: 'danger',
    text: 'Oh snap! Change a few things up <strong class="txt-dark"> Notification check</strong>',
    icon: 'icon-heart',
    buttonText: 'Alert',
  },
];

export const additionalContentData = [
  {
    colorClass: 'primary',
    title: 'Please! Check your notifications',
    desc: 'The duty of notification is imposed upon the head of the family, and also upon the medical practitioner who may be in attendance on the patient.',
    text: 'The emergency notification system is free and is available in all 50 states.',
  },
  {
    colorClass: 'secondary',
    title: 'Something went wrong! Please, chrome update.',
    desc: 'The duty of notification is imposed upon the head of the family, and also upon the medical practitioner who may be in attendance on the patient.',
    text: 'Whenever you need to, be sure to use margin utilities to keep things nice and tidy.',
  },
  {
    colorClass: 'success',
    title: 'Please! Hidden cameras were not installed.',
    desc: 'Due to increasingly accessible technology, hidden cameras have grown in popularity among regular people in recent years.',
    text: 'Consider moving clocks and plush animals from your area if you think they may be concealing cameras because they are both portable items.',
  },
];
