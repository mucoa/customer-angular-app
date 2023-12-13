import { Component } from '@angular/core';
import { GetCustomerModel } from './models/get-customer.model';
import { ApiService } from '../../api.service';
import { ToastService } from '@siemens/ix-angular';
import { HttpErrorResponse } from '@angular/common/http';
import { JWTTokenService } from '../../token.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.scss'
})
export class CustomerComponent {
  pageSize: number;
  page: number;
  isLoading: boolean;
  customerModel?: GetCustomerModel;
  pageCount?: number;

  customSearch = '';
  display = 'none';

  constructor(private readonly apiService: ApiService,
    private toastService: ToastService,
    private router: Router) {
    this.isLoading = false;
    this.page = 1;
    this.pageSize = 10;
  }

  ngOnInit(): void {
    if (!this.apiService.checkUserPermission('Admin')) {
      this.apiService.userLoggedOut();
      return;
    }

    if (this.customSearch !== '') {
      this.display = 'block';
    }
    this.getCustomers();
  }

  clearInput() {
    this.customSearch = '';
    this.display = 'none';
    this.getCustomers();
  }

  onKey(event: any) {
    event.target.value === ''
      ? (this.display = 'none')
      : (this.display = 'block');
      this.getCustomers();
  }

  getCustomers() {
    this.isLoading = true;
    this.apiService.get({
      endpoint: "customers",
      isAuthenticationRequired: true,
      parameters: `searchText=${this.customSearch}&sortColumn=number&sortOrder=desc&page=${this.page}&pageSize=${this.pageSize}`
    })
      .subscribe({
        next: (res) => {
          this.customerModel = res.body as GetCustomerModel;
          this.pageCount = Math.ceil((this.customerModel?.totalCount ?? 0) / this.pageSize);
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

  deleteCustomer(id: string) {
    this.isLoading = true;
    this.apiService.delete({
      endpoint: `customers/${id}`,
      isAuthenticationRequired: true,
    })
      .subscribe({
        next: (res) => {
          this.toastService.show({
            title: 'Successfully',
            message: 'Customer deleted.',
            type: 'success'
          });
          this.getCustomers();
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
    this.getCustomers();
  }

}
