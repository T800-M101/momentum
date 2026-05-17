import { Component, HostListener, inject, signal } from '@angular/core';
import { ThemeService } from '../../core/services/theme/theme-service';
import { LucideAngularModule } from 'lucide-angular';
import {
  NotebookPen,
  NotebookTabs,
  CalendarDays,
  Settings,
  SquarePen,
  Moon,
  Sun,
  LogOut,
} from 'lucide-angular';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth-service';
import { IconsService } from '../../core/services/icons/icons-service';

@Component({
  selector: 'app-mobile-nav',
  imports: [LucideAngularModule, RouterModule],
  templateUrl: './mobile-nav.html',
  styleUrl: './mobile-nav.css',
})
export class MobileNav {
  themeService = inject(ThemeService);
  private authService = inject(AuthService);
  private iconsService = inject(IconsService);
  showSettingsMenu = signal(false);

  icons = this.iconsService.icons;

  isMenuOpen = signal(false);

  toggleMenu(event: Event) {
    event.stopPropagation();
    this.isMenuOpen.update((v) => !v);
  }

  @HostListener('document:click')
  closeMenu() {
    this.isMenuOpen.set(false);
  }

  toggleSettingsMenu() {
    this.showSettingsMenu.update((v) => !v);
  }

  logout(): void {
    this.authService.logout();
  }
}
