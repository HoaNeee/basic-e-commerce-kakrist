export interface PaymentMethodModel {
  user_id: string;
  cardNumber: string;
  cardName: string;
  CVV: string;
  expiryDate: string;
  method: string;
  deleted: boolean;
  _id: string;
  createdAt: string;
  updatedAt: string;
}
