import { Component, inject } from '@angular/core';
import { ThemeService } from '../../core/services/theme-service';

@Component({
  selector: 'app-mobile-nav',
  imports: [],
  templateUrl: './mobile-nav.html',
  styleUrl: './mobile-nav.css',
})
export class MobileNav {
  themeService = inject(ThemeService);
}
