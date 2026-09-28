export interface flushAccordion {
  panel: string;
  title: string;
  class: string;
  data: data[];
}
export interface data {
  desc: string;
}

export const simpleAccordionData = [
  {
    panel: 'First',
    title: 'What do web designers do?',
    desc: 'Web design<em class="txt-danger"> identifies the goals</em> of a website or webpage and promotes accessibility for all potential users. This process involves organizing content and images across a series of pages and integrating applications and other interactive elements.',
  },
  {
    panel: 'Second',
    title: 'What is the use of web design?',
    desc: '<strong> Search engine optimization: </strong> Search engine optimization (SEO) is a method for improving the chances for a website to be found by search engines. Web design codes information in a way that search engines can read it. It can boost business because the site shows up on the top search result pages, helping people to find it.<br><br><strong> Mobile responsiveness:</strong> Mobile responsiveness is the feature of a website that allows it to display on a mobile device and adapt its layout and proportions to be legible. Web design ensures sites are easy to view and navigate from mobile devices. When a website is well-designed and mobile-responsive, customers can reach the business with ease.<br><br><strong> Improved sales:</strong>Increasing the number of items sold or acquiring more active customers are objectives of a compelling website. As web design reaches targeted customers and search engines, it helps the business make conversions on their site and improve its sales.',
  },
  {
    panel: 'Third',
    title: 'What are the elements of web design?',
    desc: 'The web design process allows designers to adjust to any preferences and provide effective solutions. There are many standard components of every web design, including:<br>--> Layout<br>--> Images<br>--> Visual hierarchy<br>--> Color scheme<br>--> Typography<br>--> Navigation<br>--> Readability<br>--> Content',
  },
];

export const flushAccordionData: flushAccordion[] = [
  {
    panel: 'First',
    title: 'What is bootstrap?',
    class: 'gap-1',
    data: [
      {
        desc: '--> Bootstrap is the most popular HTML, CSS and JavaScript framework for developing a responsive and mobile friendly website.',
      },
      {
        desc: '--> It is absolutely free to download and use.',
      },
    ],
  },
  {
    panel: 'Second',
    title: 'Why Should You Use Bootstrap?',
    class: 'gap-2',
    data: [
      {
        desc: 'First and foremost, Bootstrap is easy to learn. Due to its popularity, plenty of tutorials and online forums are available to help you get started.',
      },
      {
        desc: 'One of the reasons why Bootstrap is so popular among web developers and web designers is that it has a simple file structure. Its files are compiled for easy access, and it only requires basic knowledge of HTML, CSS, and JS to modify them.',
      },
      {
        desc: 'You can also use themes for popular content management systems as learning tools. For example, most WordPress themes were developed using Bootstrap, which any beginner web developer can access.',
      },
      {
        desc: "To increase the site's page load time, Bootstrap minifies the CSS and JavaScript files. Additionally, Bootstrap maintains consistency across the syntax between websites and developers, which is ideal for team-based projects.",
      },
    ],
  },
  {
    panel: 'Third',
    title: 'Bootstrap Image System',
    class: 'gap-3',
    data: [
      {
        desc: 'Bootstrap handles the image display and responsiveness with its predefined HTML and CSS rules.',
      },
      {
        desc: "Adding the .img-responsive class will automatically resize images based on the users' screen size. This will benefit your website’s performance, as reducing image sizes is part of the site optimization process.",
      },
      {
        desc: "Bootstrap also provides additional classes like .img-circle and .img-rounded, which help to modify the images' shape.",
      },
    ],
  },
];

export const accordionWithIconData = [
  {
    title: 'Keep in touch',
    id: 'panelsStayOpen-headingOne',
    desc: ' <em class="txt-danger"> " This page might not behave as expected because Windows Internet Explorer isn`t configured to load unsigned ActiveX controls."</em> or "Allow this page to install an unsigned ActiveX Control? Doing so from untrusted sources may harm your computer." (Both phrased as conditions that may cause future problems.)',
    icon: 'bell',
  },
  {
    title: 'Chats with others',
    id: 'panelsStayOpen-headingTwo',
    desc: "You get the same features in Chat and Chat in Gmail, but the integrated Gmail experience provides a central location to communicate with friends, family, or coworkers between emails.<br><strong> Chat:</strong> Use when you prefer a dedicated chat experience and don't mind switching between different apps.",
    icon: 'message-circle',
  },
  {
    id: 'panelsStayOpen-headingThree',
    title: 'Right way to code',
    desc: "1) Decide on the indentation and keep it that way.<br>2) Make comments.<br>3) Consistent name scheme.<br>4) Don't repeat code.<br>5) Avoid writing long code lines.<br>6) Break down a big task into smaller chunks.<br>7) Organize your program into smaller files.<br>8) Write clever code that is also readable.",
    icon: 'check-square',
  },
];
