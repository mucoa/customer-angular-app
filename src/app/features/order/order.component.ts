import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';
import { ToastService } from '@siemens/ix-angular';
import { HttpErrorResponse } from '@angular/common/http';
import { GetOrderModel } from './models/get-order.model';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss'
})
export class OrderComponent implements OnInit {
  pageSize: number;
  page: number;
  isLoading: boolean;
  orderModel?: GetOrderModel;
  pageCount?: number;

  customSearch = '';
  display = 'none';

  constructor(private readonly apiService: ApiService,
    private toastService: ToastService) {
    this.isLoading = false;
    this.page = 1;
    this.pageSize = 10;
  }

  ngOnInit(): void {
    if (!this.apiService.checkUserPermission('GetOrders')) {
      this.apiService.userLoggedOut();
      return;
    }
    if (this.customSearch !== '') {
      this.display = 'block';
    }
    this.getOrders();
  }

  clearInput() {
    this.customSearch = '';
    this.display = 'none';
    this.getOrders();
  }

  onKey(event: any) {
    event.target.value === ''
      ? (this.display = 'none')
      : (this.display = 'block');
      this.getOrders();
  }

  getOrders() {
    this.isLoading = true;
    this.apiService.get({
      endpoint: "orders",
      isAuthenticationRequired: true,
      parameters: `searchText=${this.customSearch}&sortColumn=number&sortOrder=desc&page=${this.page}&pageSize=${this.pageSize}`
    })
      .subscribe({
        next: (res) => {
          this.orderModel = res.body as GetOrderModel;
          this.pageCount = Math.ceil((this.orderModel?.totalCount ?? 0) / this.pageSize);
        },
        error: (e: HttpErrorResponse) => {
          if (e.status == 401) {
            this.apiService.userLoggedOut();
          }
          this.toastService.show({
            message: 'An error occurred, please try again.',
            type: 'error'
          });
        },
      }).add(() => {
        this.isLoading = false;
      });
  }

  onPageSelect(event: Event) {
    const customEvent = event as CustomEvent<number>;
    this.page = customEvent.detail + 1;
    this.getOrders();
  }
}
