import { Component, inject } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { IconsService } from '../../core/services/icons/icons-service';
import { AuthService } from '../../core/services/auth/auth-service';
import { JournalService } from '../../core/services/journal/journal-service';

@Component({
  selector: 'popover',
  imports: [LucideAngularModule],
  templateUrl: './popover.html',
  styleUrl: './popover.css',
})
export class Popover {
  private authService = inject(AuthService);
  private iconsService = inject(IconsService);
  private journalService = inject(JournalService);
  icons = this.iconsService.icons;
  stats = this.journalService.stats;

  onLogout() {
    this.authService.logout();
    this.journalService.loadStats();
  }
}
