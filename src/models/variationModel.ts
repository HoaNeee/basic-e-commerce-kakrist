/* eslint-disable @typescript-eslint/no-explicit-any */

import { OptionsInfo } from "./productModel";

export interface VariationModel {
  _id: string;
  title: string;
  key: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  options: OptionsInfo[];
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
