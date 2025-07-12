export interface BillModel {
  _id: string;
  user_id: string;
  products: Product[];
  promotion?: Promotion;
  shippingAddress: string;
  status: string;
  paymentMethod: string;
  paymentStatus: number;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Promotion {
  promotionType: string;
  value: number;
  code: string;
}

interface Product {
  title: string;
  price: number;
  thumbnail: string;
  options: string[];
  quantity: number;
  _id: string;
}
