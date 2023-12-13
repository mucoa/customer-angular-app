import { Output, EventEmitter, Component } from '@angular/core';
import { Router } from '@angular/router';
import { themeSwitcher } from '@siemens/ix-angular';
import { JWTTokenService } from '../../token.service';

@Component({
  selector: 'app-basic-navigation',
  templateUrl: './basic-navigation.component.html',
  styleUrl: './basic-navigation.component.scss'
})
export class BasicNavigationComponent {

  @Output() logOut: EventEmitter<any> = new EventEmitter();

  themes = ['theme-classic-light', 'theme-classic-dark'];
  themesNames = ['Light', 'Dark'];

  selectedTheme = this.themes[1];

  constructor(private router: Router, 
    private tokenService: JWTTokenService) {
  }

  getUrl() {
    return this.router.url;
  }

  checkUserPermission(permission: string) {
    return (new Map(Object.entries(this.tokenService.getDecodeToken())).get('permissions') as string[]).includes(permission);
  }

  onItemSelectionChange(event: Event) {
    const customEvent = event as CustomEvent<string[]>;
    const newTheme = customEvent.detail[0];
    themeSwitcher.setTheme(newTheme);
    this.selectedTheme = newTheme;
  }

  toggleMode() {
    themeSwitcher.toggleMode();
    this.selectedTheme = themeSwitcher.getCurrentTheme();
  }

  onSystemMode({ target }: Event) {
    if ((target as HTMLInputElement).checked) {
      themeSwitcher.setVariant();
      return;
    }

    themeSwitcher.setTheme(this.selectedTheme);
  }
}
