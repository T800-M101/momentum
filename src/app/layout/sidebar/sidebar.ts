import { Component, inject } from '@angular/core';
import { ThemeService } from '../../core/services/theme-service';

@Component({
  selector: 'app-sidebar',
  imports: [],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  themeService = inject(ThemeService);
}
