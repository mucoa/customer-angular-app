export interface GetCustomerModel {
  items: Item[];
  page: number;
  pageSize: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface Item {
  id: string;
  identity: string;
  name: string;
  phoneNumber: string;
  emailAddress: string;
  address: string;
  birthDate: string;
  company?: any;
  createdAt: string;
  orders: any[];
}