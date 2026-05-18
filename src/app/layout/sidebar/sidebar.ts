import { Component, HostListener, inject, signal } from '@angular/core';
import { ThemeService } from '../../core/services/theme/theme-service';
import { RouterModule } from '@angular/router';
import { IconsService } from '../../core/services/icons/icons-service';
import { LucideAngularModule } from 'lucide-angular';
import { Popover } from '../../shared/popover/popover';


@Component({
  selector: 'app-sidebar',
  imports: [RouterModule, LucideAngularModule, Popover],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  themeService = inject(ThemeService);
  private iconsService = inject(IconsService);

  isMenuOpen = signal(false);
  icons = this.iconsService.icons;
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
