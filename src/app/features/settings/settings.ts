import { Component, inject } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { ThemeService } from '../../core/services/theme/theme-service';
import { Moon, Sun } from 'lucide-angular';

@Component({
  selector: 'app-settings',
  imports: [LucideAngularModule],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings {
  themeService = inject(ThemeService);

  readonly icons = {
    Moon,
    Sun,
  };
}
