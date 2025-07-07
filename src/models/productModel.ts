/* eslint-disable @typescript-eslint/no-explicit-any */

export interface ProductModel {
  _id: string;
  title: string;
  content?: string;
  shortDescription?: string;
  categories: string[];
  price?: number | string;
  stock?: number | string;
  productType: "simple" | "variations";
  images?: string[];
  supplier_id: string;
  deleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
  slug: string;
  thumbnail?: string;
  SKU?: string;
  variation_ids?: string[];
  rangeStock?: number;
  rangePrice?: {
    min: number;
    max: number;
  };
  supplierName: string;
  discountedPrice?: number;
  review?: {
    numberPeople: number;
    average: number;
  };
}

export interface SubProductModel {
  _id: string;
  options: string[];
  product_id?: string;
  price?: number | string;
  thumbnail?: string | any | File;
  stock?: number | string;
  SKU?: string;
  discountedPrice?: number;
  key_combi?: string;
  sub_product_id?: string;
}

export interface OptionsInfo {
  title: string;
  value: string;
  variation_id?: string;
}

export interface SubProductDetail extends SubProductModel {
  options_info?: OptionsInfo[];
}

export interface SubProductOptionModel {
  sub_product_id: string;
  variation_option_id: string;
}
