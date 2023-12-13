import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ApiService } from '../../../api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { provideNgxMask } from 'ngx-mask';
import { ModalService, ToastService } from '@siemens/ix-angular';
import { CustomResult } from '../../models/custom.result.model';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrl: './add-customer.component.scss',
  providers: [
    provideNgxMask()
  ]
})
export class AddCustomerComponent implements OnInit {
  @ViewChild('customerAddSaveModal', { read: TemplateRef })
  customModalRef!: TemplateRef<any>;
  form: FormGroup;
  isLoading: boolean;
  submitted = false;

  constructor(formBuilder: FormBuilder,
    private apiService: ApiService,
    private toastService: ToastService,
    private modalService: ModalService,
    private router: Router) {
    this.form = formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      identification: ['', [Validators.required, Validators.maxLength(11), Validators.minLength(11), Validators.pattern("^[0-9]*$"),]],
      name: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required]],
      address: ['', [Validators.required]],
      birthdate: ['', [Validators.required]],
      company: ['']
    }, { validators: null });
    this.isLoading = false;
  }

  ngOnInit(): void {
    if (!this.apiService.checkUserPermission('CreateCustomer')) {
      this.apiService.userLoggedOut();
      return;
    }
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

  async onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      const instance = await this.modalService.open({
        content: this.customModalRef,
        animation: true,
        centered: true,
        closeOnBackdropClick: true,
      });

      instance.onClose.on((a) => {
        console.log(this.birthdate?.value);
        if (a == 'yes') {
          var formattedDate = this.birthdate?.value.substring(4) + '-' + this.birthdate?.value.substring(2, 4) + '-' + this.birthdate?.value.substring(0, 2);
          this.isLoading = true;
          this.apiService.post({
            endpoint: "customers",
            isAuthenticationRequired: true,
            body: {
              "identity": this.identification?.value,
              "name": this.name?.value,
              "phoneNumber": this.phoneNumber?.value,
              "emailAddress": this.email?.value,
              "address": this.address?.value,
              "birthdate": formattedDate,
              "company": this.company?.value
            },
          })
            .subscribe({
              next: () => {
                this.toastService.show({
                  title: 'Successfully',
                  message: 'Customer saved.',
                  type: 'success'
                });
                this.router.navigate(['/home/customers']);
              },
              error: (e: HttpErrorResponse) => {
                this.toastService.show({
                  message: (e.error as CustomResult)?.errorMessage ?? 'An error occurred while saving, please try again.',
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