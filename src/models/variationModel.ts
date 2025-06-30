/* eslint-disable @typescript-eslint/no-explicit-any */

export interface VariationModel {
  _id: string;
  title: string;
  key: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  options: {
    value: string;
    title: string;
    variation_id: string;
  }[];
  __v: number;
}

export interface VariationOptionModel {
  _id: string;
  title: string;
  key: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
