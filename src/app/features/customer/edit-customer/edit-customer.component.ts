import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ApiService } from '../../../api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GetCustomerByIdModel, Order } from './model/get-customer-by-id.model';
import { ModalService, ToastService } from '@siemens/ix-angular';
import { CustomResult } from '../../models/custom.result.model';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-edit-customer',
  templateUrl: './edit-customer.component.html',
  styleUrl: './edit-customer.component.scss'
})
export class EditCustomerComponent implements OnInit, OnDestroy {
  @ViewChild('customerUpdateModal', { read: TemplateRef })
  customModalRef!: TemplateRef<any>;
  id?: string;
  private sub: any;
  isLoading: boolean;
  model?: GetCustomerByIdModel;
  form: FormGroup;
  addForm: FormGroup;
  submitted = false;
  addSubmitted = false;

  constructor(formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private toastService: ToastService,
    private modalService: ModalService,
    private router: Router
  ) {
    this.form = formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      identification: ['', [Validators.required, Validators.maxLength(11), Validators.minLength(11), Validators.pattern("^[0-9]*$"),]],
      name: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required]],
      address: ['', [Validators.required]],
      birthdate: ['', [Validators.required]],
      company: ['']
    }, { validators: null });
    this.addForm = formBuilder.group({
      product: ['', [Validators.required]],
      price: ['', [Validators.required]],
    }, { validators: null });
    this.isLoading = false;
  }

  ngOnInit() {
    if (!this.apiService.checkUserPermission('UpdateCustomer')) {
      this.apiService.userLoggedOut();
      return;
    }
    this.isLoading = true;

    this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];
    });

    this.getCustomer();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  removeOrder(id: string){
    if(this.model?.orders != null)
    {
      this.model!.orders = this.model?.orders.filter(x => x.id !== id);
      console.log(this.model.orders);
    }
  }

  ///TODO: complete add order
  addOrder(order: Order){
    if(this.model?.orders != null)
    {
      this.model!.orders.push(order);
    }
  }

  ///TODO: complete add order
  get product() {
    return this.form.get('product');
  }
  ///TODO: complete add order
  get price() {
    return this.form.get('price');
  }

  get email() {
    return this.form.get('email');
  }

  get identification() {
    return this.form.get('identification');
  }

  get name() {
    return this.form.get('name');
  }

  get phoneNumber() {
    return this.form.get('phoneNumber');
  }

  get address() {
    return this.form.get('address');
  }

  get birthdate() {
    return this.form.get('birthdate');
  }

  get company() {
    return this.form.get('company');
  }


  getCustomer() {
    this.isLoading = true;
   this.apiService.get({
      endpoint: `customers/${this.id as string}`,
      isAuthenticationRequired: true,
    }).subscribe({
      next: (res) => {
        this.model = res.body as GetCustomerByIdModel;
        this.identification?.setValue(this.model.identity);
        this.name?.setValue(this.model.name);
        this.phoneNumber?.setValue(this.model.phoneNumber);
        this.address?.setValue(this.model.address);
        this.email?.setValue(this.model.emailAddress);
        this.birthdate?.setValue(formatDate(this.model.birthDate, 'dd/MM/yyyy', 'en-US'));
        this.company?.setValue(this.model.company);
      },
      error: (e: HttpErrorResponse) => {
        if (e.status == 401) {
          this.apiService.userLoggedOut();
        }
        this.toastService.show({
          message: (e.error as CustomResult)?.errorMessage ?? 'An error occurred, please try again.',
          type: 'error'
        });
      },
    }).add(() => {
      this.isLoading = false;
    });
  }

  async onSubmit() {
    if (this.birthdate?.value.length == 8) {
      var formattedDate = this.birthdate?.value.substring(4) + '-' + this.birthdate?.value.substring(2, 4) + '-' + this.birthdate?.value.substring(0, 2);
      
    }else{
      var formattedDate = this.birthdate?.value.substring(6) + '-' + this.birthdate?.value.substring(3, 5) + '-' + this.birthdate?.value.substring(0, 2);
    }

    this.submitted = true;
    if (this.form.valid) {
      
      const instance = await this.modalService.open({
        content: this.customModalRef,
        animation: true,
        centered: true,
        closeOnBackdropClick: true,
      });
      
      instance.onClose.on((a) => {
        
        if (a == 'yes') {
          this.isLoading = true;
          this.apiService.put({
            endpoint: "customers",
            isAuthenticationRequired: true,
            body: {
              "id": this.model?.id,
              "identity": this.identification?.value,
              "name": this.name?.value,
              "phoneNumber": this.phoneNumber?.value,
              "emailAddress": this.email?.value,
              "address": this.address?.value,
              "birthdate": formattedDate,
              "company": this.company?.value,
              "orders": this.model?.orders,
            },
          })
            .subscribe({
              next: () => {
                this.toastService.show({
                  title: 'Successfully',
                  message: 'Customer updated.',
                  type: 'success'
                });
                this.router.navigate(['/home/customers']);
              },
              error: (e: HttpErrorResponse) => {
                this.toastService.show({
                  message: (e.error as CustomResult)?.errorMessage ?? 'An error occurred while updating, please try again.',
                  type: 'error'
                });
              },
            }).add(() => {
              this.isLoading = false;
            });
        }
      });
    }
  }
}
