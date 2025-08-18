export interface OrderModel {
  _id: string;
  user_id: string;
  products: Product[];
  promotion?: Promotion;
  shippingAddress: Address;
  totalPrice?: number;
  orderNo: string;
  status: string;
  paymentMethod: string;
  paymentStatus: number;
  deleted: boolean;
  estimatedDelivery: Date;
  delivered: Date;
  cancel?: {
    canceledBy: string;
    canceledAt: Date;
    reasonCancel: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface Promotion {
  promotionType: string;
  value: number;
  code: string;
}

interface Address {
  name: string;
  address: string;
  phone: string;
}

interface Product {
  _id: string;
  title: string;
  price: number;
  thumbnail: string;
  quantity: number;
  product_id: string;
  sub_product_id: string;
  slug: string;
  SKU: string;
  options: string[];
  reviewed: boolean;
}
