import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IxModule } from '@siemens/ix-angular';
import { HomeComponent } from './features/home/home.component';
import { BasicNavigationComponent } from './layouts/basic-navigation/basic-navigation.component';
import { LoginComponent } from './features/login/login.component';
import { LoginFormComponent } from './features/login/login-form/login-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LocalStorageService } from './local.storage.service';
import { JWTTokenService } from './token.service';
import { OrderComponent } from './features/order/order.component';
import { CustomerComponent } from './features/customer/customer.component';
import { AddCustomerComponent } from './features/customer/add-customer/add-customer.component';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { EditCustomerComponent } from './features/customer/edit-customer/edit-customer.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    BasicNavigationComponent,
    LoginComponent,
    LoginFormComponent,
    OrderComponent,
    CustomerComponent,
    AddCustomerComponent,
    EditCustomerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    IxModule.forRoot(),
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxMaskDirective, 
    NgxMaskPipe,
  ],
  providers: [
    LocalStorageService,
    JWTTokenService,
    provideNgxMask()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
