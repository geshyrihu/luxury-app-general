export interface progresBar {
  header: string;
  desc: string;
  class?: string;
  data: data[];
}

export interface data {
  colorClass?: string;
  width: string;
  height?: string;
  text?: number;
}

export const basicProgressBarData: progresBar[] = [
  {
    header: 'Basic progress bars',
    desc: 'Progress components are built with two HTML elements, some CSS to set the width, and a few attributes.We use the <code>.progress </code>as a wrapper to indicate the max value of the progress bar. The <code>.progress-bar </code>requires an inline style, utility class, or custom CSS to set their width.',
    class: 'progress-bar bg',
    data: [
      {
        colorClass: '',
        width: '',
      },
      {
        colorClass: 'primary',
        width: '25%',
      },
      {
        colorClass: 'secondary',
        width: '50%',
      },
      {
        colorClass: 'success',
        width: '75%',
      },
      {
        colorClass: 'info',
        width: '100%',
      },
    ],
  },
];

export const stripedData: progresBar[] = [
  {
    header: 'Progress bars striped',
    desc: "Add <code>.progress-bar-striped</code> to any <code>.progress-bar </code> to apply a stripe via CSS gradient over the progress bar's background color Using CSS Effects.",
    class: 'progress-bar progress-bar-striped',
    data: [
      {
        colorClass: 'primary',
        width: '10%',
      },
      {
        colorClass: 'warning',
        width: '25%',
      },
      {
        colorClass: 'danger',
        width: '50%',
      },
      {
        colorClass: 'success',
        width: '75%',
      },
    ],
  },
];

export const stripedAnimatedData: progresBar[] = [
  {
    header: 'Progress Bars animated',
    desc: 'The striped gradient can also be animated. Add <code>.progress-bar-animated</code> to<code>.progress-bar</code> to animate the stripes right to left via CSS3 animations.',
    class: 'progress-bar-animated progress-bar-striped',
    data: [
      {
        colorClass: 'primary',
        width: '10%',
      },
      {
        colorClass: 'warning',
        width: '25%',
      },
      {
        colorClass: 'danger',
        width: '50%',
      },
      {
        colorClass: 'success',
        width: '75%',
      },
    ],
  },
];

export const multipalBarData = [
  {
    header: 'Multiple bars',
    desc: 'Include multiple progress bars in a progress component if you need.',
    class: 'progress-bar',
    data1: [
      {
        colorClass: 'primary',
        width: '30%',
      },
      {
        colorClass: 'secondary',
        width: '20%',
      },
      {
        colorClass: 'success',
        width: '15%',
      },
    ],
    data2: [
      {
        colorClass: 'primary',
        width: '10%',
      },
      {
        colorClass: 'secondary',
        width: '10%',
      },
      {
        colorClass: 'success',
        width: '10%',
      },
      {
        colorClass: 'info',
        width: '10%',
      },
      {
        colorClass: 'warning',
        width: '10%',
      },
      {
        colorClass: 'danger',
        width: '10%',
      },
      {
        colorClass: 'primary',
        width: '10%',
      },
      {
        colorClass: 'light',
        width: '10%',
      },
    ],
  },
];

export const customeProgressData = [
  {
    header: 'Custom Progress Bars',
    desc: 'Use the <code>.progress-bar-animated </code>and <code>.progress-bar-striped </code>to animate the stripes right to left.',
    data: [
      {
        label: '0% Getting Started',
        colorClass: '',
        width: '',
      },
      {
        label: '30% Getting Uploading...',
        colorClass: 'primary',
        width: '30%',
      },
      {
        label: '60% Getting Pause...',
        colorClass: 'secondary',
        width: '60%',
      },
      {
        label: '70% Getting Uploading...',
        colorClass: 'success',
        width: '70%',
      },
      {
        label: '100% Completed',
        colorClass: 'dark',
        width: '100%',
      },
    ],
  },
];

export const smallProgressBarData: progresBar[] = [
  {
    header: 'Small Progress Bars',
    desc: 'Use <code> .sm-progress-bar</code>  class to change progress size to small:',
    data: [
      {
        width: '30%',
        text: 30,
      },
      {
        width: '50%',
        text: 50,
      },
      {
        width: '75%',
        text: 75,
      },
      {
        width: '90%',
        text: 90,
      },
    ],
  },
];

export const largeProgressBarData: progresBar[] = [
  {
    header: 'Large Progress Bars',
    desc: 'Use <code> .lg-progress-bar</code>  class to change progress size to large:',
    data: [
      {
        colorClass: 'primary',
        width: '25%',
      },
      {
        colorClass: 'secondary',
        width: '50%',
      },
      {
        colorClass: 'success',
        width: '75%',
      },
      {
        colorClass: 'info',
        width: '100%',
      },
    ],
  },
];

export const customHeightProgressBarData: progresBar[] = [
  {
    header: 'Custom Height Progress Bars',
    desc: 'Set a height value on the <code>.progress-bar</code>, so if you change that value the outer<code>.progress</code> will automatically resize accordingly.',
    class: 'progress-bar bg',
    data: [
      {
        colorClass: 'primary',
        width: '25%',
        height: '1px',
      },
      {
        colorClass: 'warning',
        width: '50%',
        height: '5px',
      },
      {
        colorClass: 'danger',
        width: '75%',
        height: '11px',
      },
      {
        colorClass: 'info',
        width: '100%',
        height: '19px',
      },
    ],
  },
];
