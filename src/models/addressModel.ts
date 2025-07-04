export interface AddressModel {
  city: CityModel;
  district: CityModel;
  ward: CityModel;
  _id: string;
  user_id: string;
  name: string;
  phone: string;
  houseNo: string;
  isDefault: boolean;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CityModel {
  title: string;
  value: string;
}
