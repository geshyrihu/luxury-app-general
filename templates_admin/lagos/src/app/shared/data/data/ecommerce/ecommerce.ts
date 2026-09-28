export interface cart {
  id: number;
  counter: number;
  productImg: string;
  productName: string;
  price: number;
  total: number;
}

export const filterData = [
  {
    title: 'Category',
    data: [
      {
        id: 'edo-ani5',
        type: 'checkbox',
        name: 'Man Shirt',
      },
      {
        id: 'edo-ani6',
        type: 'checkbox',
        name: 'Man Jeans',
      },
      {
        id: 'edo-ani7',
        type: 'checkbox',
        name: 'Woman Top',
      },
      {
        id: 'edo-ani8',
        type: 'checkbox',
        name: 'Woman Jeans',
      },
      {
        id: 'edo-ani9',
        type: 'checkbox',
        name: 'Man T-shirt',
      },
    ],
  },
  {
    title: 'Brand',
    data: [
      {
        id: 'chk-ani',
        type: 'checkbox',
        name: "Levi's",
      },
      {
        id: 'chk-ani1',
        type: 'checkbox',
        name: 'Diesel',
      },
      {
        id: 'chk-ani2',
        type: 'checkbox',
        name: 'Lee',
      },
      {
        id: 'chk-ani3',
        type: 'checkbox',
        name: 'Hudson',
      },
      {
        id: 'chk-ani4',
        type: 'checkbox',
        name: 'Denizen',
      },
      {
        id: 'chk-ani5',
        type: 'checkbox',
        name: 'Spykar',
      },
    ],
  },
];

export const productFilter = [
  {
    item: [
      {
        img: 'assets/images/ecommerce/01.jpg',
        name: 'Fancy Shirt',
        price: '100.00',
      },

      {
        img: 'assets/images/ecommerce/02.jpg',
        name: 'Fancy Shirt',
        price: '100.00',
      },
      {
        img: 'assets/images/ecommerce/03.jpg',
        name: 'Fancy Shirt',
        price: '100.00',
      },
    ],
  },
  {
    item: [
      {
        img: 'assets/images/ecommerce/01.jpg',
        name: 'Fancy Shirt',
        price: '100.00',
      },

      {
        img: 'assets/images/ecommerce/02.jpg',
        name: 'Fancy Shirt',
        price: '100.00',
      },
      {
        img: 'assets/images/ecommerce/03.jpg',
        name: 'Fancy Shirt',
        price: '100.00',
      },
    ],
  },
];

export const cartItem: cart[] = [
  {
    id: 0,
    counter: 1,
    productImg: 'assets/images/product/1.png',
    productName: 'Long Top',
    price: 21,
    total: 12456,
  },
  {
    id: 1,
    counter: 1,
    productImg: 'assets/images/product/13.png',
    productName: 'Fancy watch',
    price: 50,
    total: 12456,
  },
  {
    id: 2,
    counter: 1,
    productImg: 'assets/images/product/4.png',
    productName: 'Man shoes',
    price: 11,
    total: 12456,
  },
];

export const wishlist = [
  {
    img: 'assets/images/ecommerce/product-table-6.png',
    title: 'Women Top',
    rating: 5,
    price: 210,
    stoke: 'Out of stock',
  },
  {
    img: 'assets/images/ecommerce/product-table-5.png',
    title: 'Womem shorts',
    rating: 5,
    price: 210,
    stoke: 'In stock',
  },
  {
    img: 'assets/images/ecommerce/product-table-4.png',
    title: 'Cyclamen',
    rating: 5,
    price: 210,
    stoke: 'In stock',
  },
  {
    img: 'assets/images/ecommerce/product-table-3.png',
    title: 'Men Denim jacket',
    rating: 5,
    price: 210,
    stoke: 'In stock',
  },
  {
    img: 'assets/images/ecommerce/product-table-2.png',
    title: 'Blue shirt',
    rating: 5,
    price: 210,
    stoke: 'Out of stock',
  },
  {
    img: 'assets/images/ecommerce/product-table-1.png',
    title: 'Red shirt',
    rating: 5,
    price: 210,
    stoke: 'Out of stock',
  },
  {
    img: 'assets/images/ecommerce/product-table-1.png',
    title: 'Red Shirt',
    rating: 5,
    price: 210,
    stoke: 'In stock',
  },
  {
    img: 'assets/images/ecommerce/product-table-6.png',
    title: 'Women Top',
    rating: 5,
    price: 210,
    stoke: 'In stock',
  },
  {
    img: 'assets/images/ecommerce/product-table-5.png',
    title: 'Women shorts',
    rating: 5,
    price: 210,
    stoke: 'In stock',
  },
  {
    img: 'assets/images/ecommerce/product-table-4.png',
    title: 'Cyclamen',
    rating: 5,
    price: 210,
    stoke: 'Out of stock',
  },
  {
    img: 'assets/images/ecommerce/product-table-3.png',
    title: 'Men Denim jacket',
    rating: 5,
    price: 210,
    stoke: 'Out of stock',
  },
  {
    img: 'assets/images/ecommerce/product-table-3.png',
    title: 'Men Denim jacket',
    rating: 5,
    price: 210,
    stoke: 'In stock',
  },
  {
    img: 'assets/images/ecommerce/product-table-2.png',
    title: 'Blue shirt',
    rating: 5,
    price: 210,
    stoke: 'In stock',
  },
  {
    img: 'assets/images/ecommerce/product-table-6.png',
    title: 'Women Top',
    rating: 5,
    price: 210,
    stoke: 'In stock',
  },
  {
    img: 'assets/images/ecommerce/product-table-5.png',
    title: 'Women Short',
    rating: 5,
    price: 210,
    stoke: 'Out of stock',
  },
];

export const simplePricingCard = [
  {
    title: 'Standard',
    price: 15,
    subTitle: 'Standard Plan',
  },
  {
    title: 'Business',
    price: 25,
    subTitle: 'Business Plan',
  },
  {
    title: 'Premium',
    price: 35,
    subTitle: 'Premium Plan',
  },
  {
    title: 'Extra',
    price: 45,
    subTitle: 'Extra Plan',
  },
];

export const pricing = [
  {
    title: 'STANDARD',
    price: 10,
    subTitle: '50GB Disk Space',
  },
  {
    title: 'PREMIUM',
    price: 20,
    subTitle: '10% on all product',
  },
  {
    title: 'AUTHER PACK',
    price: 50,
    subTitle: 'Upload 50 product',
  },
  {
    title: 'AUTHER PACK',
    price: 50,
    subTitle: 'Upload 50 product',
  },
];
