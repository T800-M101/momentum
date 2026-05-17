import { Component, inject, signal } from '@angular/core';
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
  LogOut
} from 'lucide-angular';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth-service';

@Component({
  selector: 'app-mobile-nav',
  imports: [LucideAngularModule, RouterModule],
  templateUrl: './mobile-nav.html',
  styleUrl: './mobile-nav.css',
})
export class MobileNav {
  themeService = inject(ThemeService);
  private authService = inject(AuthService);
  showSettingsMenu = signal(false);

  readonly icons = {
    NotebookPen,
    NotebookTabs,
    CalendarDays,
    Settings,
    SquarePen,
    Moon,
    Sun,
    LogOut
  };

  toggleSettingsMenu() {
    this.showSettingsMenu.update((v) => !v);
  }

  logout(): void {
    this.authService.logout();
  }
}
