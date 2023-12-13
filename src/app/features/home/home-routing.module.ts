import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderComponent } from '../order/order.component';
import { HomeContentComponent } from './home-content/home-content.component';
import { CustomerComponent } from '../customer/customer.component';
import { AddCustomerComponent } from '../customer/add-customer/add-customer.component';
import { EditCustomerComponent } from '../customer/edit-customer/edit-customer.component';

const routes: Routes = [
  { path: '', component: HomeContentComponent }, 
  {
    path: 'orders',
    component: OrderComponent,
  },
  {
    path: 'customers',
    component: CustomerComponent,
  },
  {
    path: 'customers/add',
    component: AddCustomerComponent,
  },
  {
    path: 'customers/edit/:id',
    component: EditCustomerComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
