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
  resonCancel: string;
  canceledBy: string;
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
  title: string;
  price: number;
  thumbnail: string;
  options: string[];
  quantity: number;
  _id: string;
}
