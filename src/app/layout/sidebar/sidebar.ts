import { Component, inject } from '@angular/core';
import { ThemeService } from '../../core/services/theme/theme-service';
import { RouterModule } from '@angular/router';

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
import { AuthService } from '../../core/services/auth/auth-service';

@Component({
  selector: 'app-sidebar',
  imports: [LucideAngularModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  themeService = inject(ThemeService);
  private authService = inject(AuthService);

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

  onLogout() {
  this.authService.logout();
}
}
