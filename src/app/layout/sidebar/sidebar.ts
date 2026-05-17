import { Component, inject } from '@angular/core';
import { ThemeService } from '../../core/services/theme/theme-service';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth-service';
import { IconsService } from '../../core/services/icons/icons-service';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-sidebar',
  imports: [ RouterModule, LucideAngularModule ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  themeService = inject(ThemeService);
  private authService = inject(AuthService);
  private iconsService = inject(IconsService);
  icons = this.iconsService.icons


  onLogout() {
  this.authService.logout();
}
}
