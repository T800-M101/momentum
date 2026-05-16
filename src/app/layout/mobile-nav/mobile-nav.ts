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
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-mobile-nav',
  imports: [LucideAngularModule, RouterModule],
  templateUrl: './mobile-nav.html',
  styleUrl: './mobile-nav.css',
})
export class MobileNav {
  themeService = inject(ThemeService);
  showSettingsMenu = signal(false);

  readonly icons = {
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
