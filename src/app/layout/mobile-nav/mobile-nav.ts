import { Component, computed, HostListener, inject, signal } from '@angular/core';
import { ThemeService } from '../../core/services/theme/theme-service';
import { LucideAngularModule } from 'lucide-angular';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth-service';
import { IconsService } from '../../core/services/icons/icons-service';
import { Popover } from '../../shared/popover/popover';

@Component({
  selector: 'app-mobile-nav',
  imports: [LucideAngularModule, RouterModule, Popover],
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

  currentUser = this.authService.currentUser;

  userInitial = computed(() => {
    const name = this.currentUser()?.username;
    return name ? name.charAt(0).toUpperCase() : '?';
  });

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
