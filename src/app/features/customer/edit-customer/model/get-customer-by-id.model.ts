export interface GetCustomerByIdModel {
  id: string;
  identity: string;
  name: string;
  phoneNumber: string;
  emailAddress: string;
  address: string;
  birthDate: string;
  company?: any;
  createdAt: string;
  orders: Order[];
}

export interface Order {
  id: string;
  orderNumber: number;
  product: string;
  productPrice: number;
  createdAt: string;
  customer?: any;
}