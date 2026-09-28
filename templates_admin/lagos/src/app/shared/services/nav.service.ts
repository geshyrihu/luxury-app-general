import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorSubject, Subject, debounceTime, fromEvent, takeUntil } from 'rxjs';

export interface Menu {
  headTitle1?: string;
  level?: number;
  headTitle2?: string;
  path?: string;
  title?: string;
  type?: string;
  icon?: string;
  active?: boolean;
  bookmark?: boolean;
  pinnedData?: boolean;
  items?: Menu[];
  children?: Menu[];
}

@Injectable({
  providedIn: 'root',
})
export class NavService {
  public screenWidth: BehaviorSubject<number> = new BehaviorSubject(window.innerWidth);

  private unsubscriber: Subject<void> = new Subject();

  public language: boolean = false;

  public collapseSidebar: boolean = window.innerWidth < 1200 ? true : false;

  private router = inject(Router);
  constructor() {
    this.setScreenWidth(window.innerWidth);

    fromEvent<UIEvent>(window, 'resize')
      .pipe(debounceTime(0), takeUntil(this.unsubscriber))
      .subscribe((evt: UIEvent) => {
        const target = evt.target as Window;
        this.setScreenWidth(target.innerWidth);

        this.collapseSidebar = target.innerWidth < 1200;
      });
  }

  private setScreenWidth(width: number): void {
    this.screenWidth.next(width);
  }

  MENUITEMS: Menu[] = [
    {
      headTitle1: 'General',
    },
    {
      level: 1,
      title: 'Dashboard',
      icon: 'home',
      type: 'sub',
      active: true,
      children: [
        { path: '/dashboard/default', title: 'Default', type: 'link' },
        { path: '/dashboard/ecommerce', title: 'Ecommerce', type: 'link' },
      ],
    },
    {
      level: 1,
      title: 'Widgets',
      icon: 'widget',
      type: 'sub',
      active: false,
      children: [
        { path: '/widgets/general', title: 'General', type: 'link' },
        { path: '/widgets/chart', title: 'Chart', type: 'link' },
      ],
    },
    {
      level: 1,
      title: 'Page Layout',
      icon: 'layout',
      type: 'sub',
      active: false,
      children: [
        { path: '/page-layout/hide-nav-scroll', title: 'Hide Nav Scroll', type: 'link' },
        { path: '/page-layout/footer-dark', title: 'Footer Dark', type: 'link' },
        { path: '/page-layout/footer-light', title: 'Footer Light', type: 'link' },
        { path: '/page-layout/footer-fixed', title: 'Footer Fixed', type: 'link' },
      ],
    },
    {
      headTitle1: 'Applications',
    },
    {
      level: 1,
      title: 'Project',
      icon: 'project',
      type: 'sub',
      active: false,
      children: [
        { path: '/project/list', title: 'Project List', type: 'link' },
        { path: '/project/create', title: 'Create New', type: 'link' },
      ],
    },
    {
      level: 1,
      path: '/file-manager',
      title: 'File Manager',
      icon: 'file',
      bookmark: true,
      type: 'link',
    },
    {
      level: 1,
      title: 'Ecommerce',
      type: 'sub',
      icon: 'ecommerce',
      active: false,
      children: [
        { path: '/ecommerce/add-products', title: 'Add Product', type: 'link' },
        { path: '/ecommerce/products', title: 'Product', type: 'link' },
        { path: '/ecommerce/product-page', title: 'Product page', type: 'link' },
        { path: '/ecommerce/product-list', title: 'Product list', type: 'link' },
        { path: '/ecommerce/payment-detail', title: 'Payment Details', type: 'link' },
        { path: '/ecommerce/order-history', title: 'Order History', type: 'link' },
        {
          level: 2,
          title: 'Invoice',
          type: 'sub',
          active: false,
          children: [
            { path: '/invoice/invoice-1', title: 'Invoice-1', type: 'link' },
            { path: '/invoice/invoice-2', title: 'Invoice-2', type: 'link' },
            { path: '/invoice/invoice-3', title: 'Invoice-3', type: 'link' },
            { path: '/invoice/invoice-4', title: 'Invoice-4', type: 'link' },
            { path: '/invoice/invoice-5', title: 'Invoice-5', type: 'link' },
            { path: '/invoice/invoice-6', title: 'Invoice-6', type: 'link' },
          ],
        },
        { path: '/ecommerce/cart', title: 'Cart', type: 'link' },
        { path: '/ecommerce/wishlist', title: 'Wishlist', type: 'link' },
        { path: '/ecommerce/checkout', title: 'Checkout', type: 'link' },
        { path: '/ecommerce/pricing', title: 'Pricing', type: 'link' },
      ],
    },
    {
      level: 1,
      path: '/letter-box',
      title: 'Letter Box',
      icon: 'email',
      type: 'link',
    },
    {
      level: 1,
      title: 'Chat',
      type: 'sub',
      icon: 'chat',
      active: false,
      children: [
        { path: '/chat/private-chat', title: 'Private Chat', type: 'link' },
        { path: '/chat/group-chat', title: 'Group Chat', type: 'link' },
      ],
    },
    {
      level: 1,
      title: 'Users',
      icon: 'user',
      type: 'sub',
      active: false,
      children: [
        { path: '/user/users-profile', title: 'Users Profile', type: 'link' },
        { path: '/user/edit-profile', title: 'Users Edit', type: 'link' },
        { path: '/user/users-cards', title: 'Users Cards', type: 'link' },
      ],
    },
    { level: 1, path: '/bookmarks', title: 'Bookmarks', icon: 'bookmark', type: 'link' },
    {
      level: 1,
      path: '/contacts',
      title: 'Contact',
      icon: 'contact',
      type: 'link',
      bookmark: true,
    },
    { level: 1, path: '/tasks', title: 'Tasks', icon: 'task', type: 'link' },
    { level: 1, path: '/calender', title: 'Calender', icon: 'calendar', type: 'link' },
    {
      level: 1,
      path: '/social-app',
      title: 'Social App',
      icon: 'social',
      bookmark: true,
      type: 'link',
    },
    { level: 1, path: '/todo', title: 'To-Do', icon: 'to-do', type: 'link' },
    { level: 1, path: '/search-result', title: 'Search Result', icon: 'search', type: 'link' },
    {
      headTitle1: 'Forms & Table',
    },
    {
      level: 1,
      title: 'Forms',
      icon: 'form',
      type: 'sub',
      active: false,
      children: [
        {
          title: 'Form Controls',
          type: 'sub',
          level: 2,
          active: false,
          children: [
            { path: '/form-controls/validation-forms', title: 'Form Validation', type: 'link' },
            { path: '/form-controls/base-inputs', title: 'Base Inputs', type: 'link' },
            { path: '/form-controls/checkbox-radio', title: 'Checkbox & Radio', type: 'link' },
            { path: '/form-controls/input-groups', title: 'Input Groups', type: 'link' },
            { path: '/form-controls/input-mask', title: 'Input Mask', type: 'link' },
            { path: '/form-controls/mega-options', title: 'Mega Options', type: 'link' },
          ],
        },
        {
          title: 'Form Widgets',
          type: 'sub',
          level: 2,
          active: false,
          children: [
            { path: '/form-widgets/datepicker', title: 'Datepicker', type: 'link' },
            { path: '/form-widgets/touchspin', title: 'Touchspin', type: 'link' },
            { path: '/form-widgets/select2', title: 'Select2', type: 'link' },
            { path: '/form-widgets/switch', title: 'Switch', type: 'link' },
            { path: '/form-widgets/typeahead', title: 'Typeahead', type: 'link' },
            { path: '/form-widgets/clipboard', title: 'Clipboard', type: 'link' },
          ],
        },
      ],
    },
    {
      level: 1,
      title: 'Tables',
      icon: 'table',
      type: 'sub',
      active: false,
      children: [
        {
          title: 'Bootstrap Tables',
          type: 'sub',
          level: 2,
          active: false,
          children: [
            { path: '/table/basic-table', title: 'Basic Table', type: 'link' },
            { path: '/table/table-components', title: 'Table components', type: 'link' },
          ],
        },
        { active: false, title: 'Data Table', type: 'link', path: '/table/datatable' },
      ],
    },
    {
      headTitle1: 'Components',
    },
    {
      level: 1,
      title: 'Ui-Kits',
      icon: 'ui-kits',
      type: 'sub',
      active: false,
      children: [
        { path: '/ui-kits/typography', title: 'Typography', type: 'link' },
        { path: '/ui-kits/avatars', title: 'Avatars', type: 'link' },
        { path: '/ui-kits/helper-classes', title: 'Helper Classes', type: 'link' },
        { path: '/ui-kits/grid', title: 'Grid', type: 'link' },
        { path: '/ui-kits/tag-pills', title: 'Tag & Pills', type: 'link' },
        { path: '/ui-kits/progress-bar', title: 'Progress', type: 'link' },
        { path: '/ui-kits/modal', title: 'Modal', type: 'link' },
        { path: '/ui-kits/alert', title: 'Alert', type: 'link' },
        { path: '/ui-kits/popover', title: 'Popover', type: 'link' },
        { path: '/ui-kits/tooltip', title: 'Tooltip', type: 'link' },
        { path: '/ui-kits/dropdown', title: 'Dropdown', type: 'link' },
        { path: '/ui-kits/according', title: 'Accordion', type: 'link' },
        { path: '/ui-kits/tabs', title: 'Tabs', type: 'link' },
        { path: '/ui-kits/lists', title: 'Lists', type: 'link' },
      ],
    },
    {
      level: 1,
      title: 'Bonus UI',
      icon: 'bonus-kit',
      type: 'sub',
      active: false,
      children: [
        { path: '/bonus-ui/toasts', title: 'Toasts', type: 'link' },
        { path: '/bonus-ui/rating', title: 'Rating', type: 'link' },
        { path: '/bonus-ui/dropzone', title: 'Dropzone', type: 'link' },
        { path: '/bonus-ui/sweetalert2', title: 'SweetAlert2', type: 'link' },
        { path: '/bonus-ui/owl-carousel', title: 'Owl Carousel', type: 'link' },
        { path: '/bonus-ui/ribbons', title: 'Ribbons', type: 'link' },
        { path: '/bonus-ui/pagination', title: 'Pagination', type: 'link' },
        { path: '/bonus-ui/breadcrumb-ui', title: 'Breadcrumb', type: 'link' },
        { path: '/bonus-ui/range-slider', title: 'Range Slider', type: 'link' },
        { path: '/bonus-ui/image-cropper', title: 'Image Cropper', type: 'link' },
        { path: '/bonus-ui/basic-card', title: 'Basic Card', type: 'link' },
        { path: '/bonus-ui/creative-card', title: 'Creative Card', type: 'link' },
        { path: '/bonus-ui/timeline', title: 'Timeline', type: 'link' },
      ],
    },
    {
      level: 1,
      title: 'Icons',
      icon: 'icons',
      type: 'sub',
      active: false,
      children: [
        { path: '/icons/flag-icon', title: 'Flag icon', type: 'link' },
        { path: '/icons/fontawesome', title: 'Fontawesome Icon', type: 'link' },
        { path: '/icons/ico-icons', title: 'Ico Icon', type: 'link' },
        { path: '/icons/themify-icons', title: 'Themify Icon', type: 'link' },
        { path: '/icons/feather-icons', title: 'Feather Icon', type: 'link' },
        { path: '/icons/weather-icons', title: 'Weather Icon', type: 'link' },
      ],
    },
    {
      level: 1,
      title: 'Buttons',
      icon: 'button',
      type: 'sub',
      active: false,
      children: [
        { path: '/buttons/default-style', title: 'Default Style', type: 'link' },
        { path: '/buttons/flat-style', title: 'Flat Style', type: 'link' },
        { path: '/buttons/edge-style', title: 'Edge Style', type: 'link' },
        { path: '/buttons/raised-style', title: 'Raised Style', type: 'link' },
        { path: '/buttons/button-group', title: 'Button Group', type: 'link' },
      ],
    },
    {
      level: 1,
      title: 'Charts',
      icon: 'charts',
      type: 'sub',
      active: false,
      children: [
        { path: '/chart/apex-chart', title: 'Apex Chart', type: 'link' },
        { path: '/chart/google-chart', title: 'Google Chart', type: 'link' },
        { path: '/chart/chartjs-chart', title: 'Chartjs Chart', type: 'link' },
        { path: '/chart/chartist-chart', title: 'Chartist Chart', type: 'link' },
      ],
    },
    {
      headTitle1: 'Pages',
    },
    { level: 1, path: '/sample-page', title: 'Sample Page', icon: 'sample-page', type: 'link' },
    {
      level: 1,
      title: 'Others',
      icon: 'others',
      type: 'sub',
      active: false,
      children: [
        {
          level: 2,
          title: 'Error Page',
          type: 'sub',
          active: false,
          children: [
            { path: '/error-page/error-400', title: 'Error 400', type: 'link' },
            { path: '/error-page/error-401', title: 'Error 401', type: 'link' },
            { path: '/error-page/error-403', title: 'Error 403', type: 'link' },
            { path: '/error-page/error-404', title: 'Error 404', type: 'link' },
            { path: '/error-page/error-500', title: 'Error 500', type: 'link' },
            { path: '/error-page/error-503', title: 'Error 503', type: 'link' },
          ],
        },
        {
          level: 2,
          title: 'Authentication',
          type: 'sub',
          active: false,
          children: [
            { path: '/authentication/simple', title: 'Login Simple', type: 'link' },
            { path: '/authentication/image-one', title: 'Login With Bg Image', type: 'link' },
            { path: '/authentication/image-two', title: 'Login With Image Two', type: 'link' },
            { path: '/authentication/validation', title: 'Login With Validation', type: 'link' },
            { path: '/authentication/tooltip', title: 'Login With Tooltip', type: 'link' },
            {
              path: '/authentication/login-sweetalert',
              title: 'Login With Sweetalert',
              type: 'link',
            },
            { path: '/authentication/register-simple', title: 'Register Simple', type: 'link' },
            {
              path: '/authentication/register-image-one',
              title: 'Register With Bg Image',
              type: 'link',
            },
            {
              path: '/authentication/register-image-two',
              title: 'Register With Image Two',
              type: 'link',
            },
            { path: '/authentication/unlock-user', title: 'Unlock User', type: 'link' },
            { path: '/authentication/forget-password', title: 'Forget Password', type: 'link' },
            { path: '/authentication/reset-password', title: 'Reset Password', type: 'link' },
            { path: '/authentication/maintenance', title: 'Maintenance', type: 'link' },
          ],
        },
        {
          level: 2,
          title: 'Coming Soon',
          type: 'sub',
          active: false,
          children: [
            { path: '/coming-soon/coming-simple', title: 'Coming Simple', type: 'link' },
            {
              path: '/coming-soon/coming-with-bg-video',
              title: 'Coming With Bg Video',
              type: 'link',
            },
            {
              path: '/coming-soon/coming-with-bg-image',
              title: 'Coming With Bg Image',
              type: 'link',
            },
          ],
        },
        {
          level: 2,
          title: 'Email templates',
          type: 'sub',
          active: false,
          children: [
            {
              path: 'https://admin.pixelstrap.net/lagos/template/basic-template.html',
              title: 'Basic Email',
              type: 'extTabLink',
            },
            {
              path: 'https://admin.pixelstrap.net/lagos/template/email-header.html',
              title: 'Basic With Header',
              type: 'extTabLink',
            },
            {
              path: 'https://admin.pixelstrap.net/lagos/template/template-email.html',
              title: 'Ecomerce Template',
              type: 'extTabLink',
            },
            {
              path: 'https://admin.pixelstrap.net/lagos/template/template-email-2.html',
              title: 'Email Template 2',
              type: 'extTabLink',
            },
            {
              path: 'https://admin.pixelstrap.net/lagos/template/template-email-2.html',
              title: 'Ecommerce Email',
              type: 'extTabLink',
            },
            {
              path: 'https://admin.pixelstrap.net/lagos/template/email-order-success.html',
              title: 'Order Success',
              type: 'extTabLink',
            },
          ],
        },
      ],
    },
    {
      headTitle1: 'Miscellaneous',
    },
    {
      level: 1,
      title: 'Gallery',
      icon: 'gallery',
      type: 'sub',
      active: false,
      children: [
        { path: '/gallary/gallary-grid', title: 'Gallery Grid', type: 'link' },
        { path: '/gallary/gallery-grid-desc', title: 'Gallery Grid Desc', type: 'link' },
        { path: '/gallary/masonry-gallery', title: 'Masonry Gallery', type: 'link' },
        { path: '/gallary/masonry-with-desc', title: 'Masonry With Desc', type: 'link' },
        { path: '/gallary/hover-effects', title: 'Hover Effects', type: 'link' },
      ],
    },
    {
      level: 1,
      title: 'Blog',
      icon: 'blog',
      type: 'sub',
      active: false,
      children: [
        { path: '/blog/blog-grids', title: 'Blog Grids', type: 'link' },
        { path: '/blog/blog-details', title: 'Blog Details', type: 'link' },
        { path: '/blog/add-post', title: 'Add Post', type: 'link' },
      ],
    },
    { level: 1, path: '/faq', title: 'FAQ', icon: 'faq', type: 'link', active: false },
    {
      level: 1,
      title: 'Job Search',
      icon: 'job-search',
      type: 'sub',
      active: false,
      children: [
        { path: '/job/cards-view', title: 'Cards View', type: 'link' },
        { path: '/job/list-view', title: 'List View', type: 'link' },
        { path: '/job/job-details', title: 'Job Details', type: 'link' },
        { path: '/job/apply', title: 'Apply', type: 'link' },
      ],
    },
    {
      level: 1,
      title: 'Learning',
      icon: 'learning',
      type: 'sub',
      active: false,
      children: [
        { path: '/learning/learinng-list', title: 'Learning List', type: 'link' },
        { path: '/learning/detailed-course', title: 'Detailed Course', type: 'link' },
      ],
    },
    {
      level: 1,
      title: 'Maps',
      icon: 'maps',
      type: 'sub',
      active: false,
      children: [
        { path: '/maps/google-map', title: 'Google Map', type: 'link' },
        { path: '/maps/leaflet-map', title: 'Leaflet Map', type: 'link' },
      ],
    },
    {
      level: 1,
      title: 'Editors',
      icon: 'editors',
      type: 'sub',
      active: false,
      children: [
        { path: '/editors/ngx-editor', title: 'Ngx Editor', type: 'link' },
        { path: '/editors/mde-editor', title: 'MDE Editor', type: 'link' },
      ],
    },
    {
      level: 1,
      path: '/knowledgebase',
      title: 'Knowledgebase',
      icon: 'knowledgebase',
      type: 'link',
      active: false,
    },
    {
      level: 1,
      path: '/support-ticket',
      title: 'Support Ticket',
      icon: 'support-tickets',
      type: 'link',
      active: false,
    },
  ];
  items = new BehaviorSubject<Menu[]>(this.MENUITEMS);

  ngOnDestroy() {
    this.unsubscriber.complete();
  }
}
