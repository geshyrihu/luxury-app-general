import { Routes } from '@angular/router';

export const Ecommerce: Routes = [
  {
    path: '',
    children: [
      {
        path: 'add-products',
        loadComponent: () => import('./add-product/add-product').then(m => m.AddProduct),
        data: {
          title: 'Add Product',
          breadcrumb: 'Add Product',
        },
      },
      {
        path: 'products',
        loadComponent: () => import('./product/product').then(m => m.Products),
        data: {
          title: 'Product',
          breadcrumb: 'Product',
        },
      },
      {
        path: 'product-page',
        loadComponent: () => import('./product-page/product-page').then(m => m.ProductPage),
        data: {
          title: 'Product Page',
          breadcrumb: 'Product Page',
        },
      },
      {
        path: 'product-list',
        loadComponent: () => import('./product-list/product-list').then(m => m.ProductList),
        data: {
          title: 'Product list',
          breadcrumb: 'Product list',
        },
      },
      {
        path: 'payment-detail',
        loadComponent: () =>
          import('./payment-details/payment-details').then(m => m.PaymentDetails),
        data: {
          title: 'Payment Details',
          breadcrumb: 'Payment Details',
        },
      },
      {
        path: 'cart',
        loadComponent: () => import('./cart/cart').then(m => m.Cart),
        data: {
          title: 'Cart',
          breadcrumb: 'Cart',
        },
      },
      {
        path: 'wishlist',
        loadComponent: () => import('./wishlist/wishlist').then(m => m.Wishlist),
        data: {
          title: 'Wishlist',
          breadcrumb: 'Wishlist',
        },
      },
      {
        path: 'checkout',
        loadComponent: () => import('./checkout/checkout').then(m => m.Checkout),
        data: {
          title: 'Checkout',
          breadcrumb: 'Checkout',
        },
      },
      {
        path: 'pricing',
        loadComponent: () => import('./pricing/pricing').then(m => m.Pricing),
        data: {
          title: 'Pricing',
          breadcrumb: 'Pricing',
        },
      },
      {
        path: 'order-history',
        loadComponent: () => import('./order-history/order-history').then(m => m.OrderHistory),
        data: {
          title: 'Recent Orders',
          breadcrumb: 'Recent Orders',
        },
      },
    ],
  },
];
