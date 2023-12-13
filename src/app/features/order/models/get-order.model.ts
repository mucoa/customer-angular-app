export interface GetOrderModel {
  items: Item[];
  page: number;
  pageSize: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface Item {
  orderNumber: number;
  product: string;
  price: number;
  customerName: string;
  date: string;
}