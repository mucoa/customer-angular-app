import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { LocalStorageService } from '../../local.storage.service';
import { JWTTokenService } from '../../token.service';
import { Router } from '@angular/router';
import { ModalService, ToastService } from '@siemens/ix-angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  @ViewChild('logoutModal', { read: TemplateRef })
  customModalRef!: TemplateRef<any>;

  constructor(private readonly storageService: LocalStorageService,
    private readonly tokenService: JWTTokenService,
    private readonly router: Router,
    private readonly modalService: ModalService,
    private readonly toastService: ToastService) {
    this.toastService.setPosition('top-right');
  }

  ngOnInit(): void {
    const token = this.storageService.get('token');
    if (token == null) {
      this.router.navigate(['/login']);
      return;
    }
    this.tokenService.setToken(token);

    if (this.tokenService.isTokenExpired()) {
      this.toastService.show({
        title: 'Session Expired',
        message: 'Your session expired, please sign in again.',
        type: 'error',
      });
      this.storageService.remove('token');
      this.router.navigate(['/login']);
      return;
    }
  }

  async logOut() {
    const instance = await this.modalService.open({
      content: this.customModalRef,
      animation: true,
      centered: true,
      closeOnBackdropClick: true,
    });

    instance.onClose.on((a) => {
      console.log(a);
      if (a == 'ok') {
        this.storageService.remove('token');
        this.router.navigate(['/login']);
      }
    });
  }
}
