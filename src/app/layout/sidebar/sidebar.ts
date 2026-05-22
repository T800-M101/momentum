import { Component, computed, HostListener, inject, signal } from '@angular/core';
import { ThemeService } from '../../core/services/theme/theme-service';
import { RouterModule } from '@angular/router';
import { IconsService } from '../../core/services/icons/icons-service';
import { LucideAngularModule } from 'lucide-angular';
import { Popover } from '../../shared/popover/popover';
import { AuthService } from '../../core/services/auth/auth-service';


@Component({
  selector: 'app-sidebar',
  imports: [RouterModule, LucideAngularModule, Popover],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  authService = inject(AuthService);
  themeService = inject(ThemeService);
  private iconsService = inject(IconsService);
  icons = this.iconsService.icons;

  currentUser = this.authService.currentUser;

  userInitial = computed(() => {
    const name = this.currentUser()?.username;
    return name ? name.charAt(0).toUpperCase() : '?';
  });

  isMenuOpen = signal(false);
  userEmail = 'memo@example.com';

  @HostListener('document:click')
  closeMenu() {
    this.isMenuOpen.set(false);
  }

  toggleMenu(event: Event) {
    event.stopPropagation();
    this.isMenuOpen.update((v) => !v);
  }
}
