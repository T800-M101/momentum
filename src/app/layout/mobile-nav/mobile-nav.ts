import { Component, inject, signal } from '@angular/core';
import { ThemeService } from '../../core/services/theme-service';
import { LucideAngularModule } from 'lucide-angular';
import {
  NotebookPen,
  NotebookTabs,
  CalendarDays,
  Settings,
  SquarePen,
  Moon,
  Sun,
} from 'lucide-angular';

@Component({
  selector: 'app-mobile-nav',
  imports: [LucideAngularModule],
  templateUrl: './mobile-nav.html',
  styleUrl: './mobile-nav.css',
})
export class MobileNav {
  themeService = inject(ThemeService);

  showSettingsMenu = signal(false);

  icons = {
    NotebookPen,
    NotebookTabs,
    CalendarDays,
    Settings,
    SquarePen,
    Moon,
    Sun,
  };

  toggleSettingsMenu() {
    this.showSettingsMenu.update((v) => !v);
  }
}
