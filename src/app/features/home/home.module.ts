import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IxModule } from '@siemens/ix-angular';

import { HomeRoutingModule } from './home-routing.module';
import { HomeContentComponent } from './home-content/home-content.component';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';

@NgModule({
  declarations: [
    HomeContentComponent,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    IxModule,
    NgxMaskDirective, 
    NgxMaskPipe
  ],
  providers: [
    provideNgxMask()
  ]
})
export class HomeModule { }
