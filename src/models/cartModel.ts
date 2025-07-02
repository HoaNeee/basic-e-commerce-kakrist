export interface CartModel {
  cart_id: string;
  cartItem_id?: string;
  product_id?: string;
  sub_product_id?: string;
  options?: string[];
  options_info?: {
    title: string;
    value: string;
  }[];
  quantity: number;
  deleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
  thumbnail?: string;
  thumbnail_sub_product?: string;
  price: number;
  discountedPrice?: number;
  productType: "simple" | "variations";
  title?: string;
}
