import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../api.service';
import { ToastService } from '@siemens/ix-angular';
import { CustomResult } from '../../models/custom.result.model';
import { JWTTokenService } from '../../../token.service';
import { LocalStorageService } from '../../../local.storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss'
})
export class LoginFormComponent implements OnInit {
  loginForm: FormGroup;
  isLoading: boolean;
  submitted = false;

  constructor(formBuilder: FormBuilder,
    private readonly apiService: ApiService,
    private readonly tokenService: JWTTokenService,
    private readonly storageService: LocalStorageService,
    private readonly toastService: ToastService,
    private readonly router: Router,
  ) {
    this.loginForm = formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    }, { validators: null });
    this.isLoading = false;
    this.toastService.setPosition('top-right');
  }

  ngOnInit(): void {
    const token = this.storageService.get('token');
    if (token != null) {
      this.tokenService.setToken(token);
      if (!this.tokenService.isTokenExpired())
        this.router.navigate(['/']);
      else
        this.storageService.remove('token');
    }
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.apiService.post({
        endpoint: "user/login",
        isAuthenticationRequired: false,
        body: {
          "email": this.email?.value,
          "password": this.password?.value
        },
      })
        .subscribe({
          next: (res) => {
            this.tokenService.setToken(res.body);
            this.storageService.set('token', res.body);
            this.router.navigate(['/']);
          },
          error: (e) => {
            this.toastService.show({
              message: (e.error as CustomResult).errorMessage ?? 'An error occurred, please try again.',
              type: 'error'
            });
          },
        }).add(() => {
          this.isLoading = false;
        });
    }
  }
}
