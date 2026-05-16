import { Component, inject } from '@angular/core';
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
  selector: 'app-sidebar',
  imports: [LucideAngularModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  themeService = inject(ThemeService);
  
  readonly icons = {
    NotebookPen,
    NotebookTabs,
    CalendarDays,
    Settings,
    SquarePen,
    Moon,
    Sun,
  };
}
