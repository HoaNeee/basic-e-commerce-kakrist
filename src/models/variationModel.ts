export interface VariationModel {
  _id: string;
  title: string;
  key: string;
  description: string;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
  options: Option[];
}

export interface Option {
  _id: string;
  title: string;
  variation_id: string;
  key: string;
}
