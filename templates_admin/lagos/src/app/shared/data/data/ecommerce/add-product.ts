export interface addProduct {
  id: string;
  svg: string;
  title: string;
  subTitle: string;
  active: boolean;
  steps: number;
}

export const addProductTabData: addProduct[] = [
  {
    id: 'detail-product-tab',
    svg: 'product-detail',
    title: 'Add Product Details',
    subTitle: 'Add Product name & details',
    active: true,
    steps: 1,
  },
  {
    id: 'gallery-product-tab',
    svg: 'product-gallery',
    title: 'Product gallery',
    subTitle: 'thumbnail & Add Product Gallery',
    active: false,
    steps: 2,
  },
  {
    id: 'pricings-tab',
    svg: 'product-category',
    title: 'Product Categories',
    subTitle: 'Add Product category, Status and Tags',
    active: false,
    steps: 3,
  },
  {
    id: 'category-product-tab',
    svg: 'pricing',
    title: 'Selling prices',
    subTitle: 'Add Product basic price & Discount',
    active: false,
    steps: 4,
  },
  {
    id: 'advance-product-tab',
    svg: 'advance',
    title: 'Advance',
    subTitle: 'Add Meta details & Inventory details',
    active: false,
    steps: 5,
  },
];
