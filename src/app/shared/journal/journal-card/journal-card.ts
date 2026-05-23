import {
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { JournalEntry } from '../../../core/interfaces/journal-entry.interface';
import { Router } from '@angular/router';
import { IconsService } from '../../../core/services/icons/icons-service';
import { JournalService } from '../../../core/services/journal/journal-service';
import { Modal } from '../../modal/modal';
import { ToastrService } from '../../../core/services/toastr/toastr-service';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';

@Component({
  selector: 'app-journal-card',
  imports: [LucideAngularModule, Modal, ClickOutsideDirective],
  templateUrl: './journal-card.html',
  styleUrl: './journal-card.css',
})
export class JournalCard {
  private router = inject(Router);
  private journalService = inject(JournalService);
  private toastr = inject(ToastrService);

  private iconsService = inject(IconsService);
  icons = this.iconsService.icons;

  showDeleteModal = signal(false);
  showMenu = signal(false);
  entry = input.required<JournalEntry>();
  dateDetails = computed(() => {
    const dateValue = new Date(this.entry().date);

    return {
      day: dateValue.getDate(),
      dayName: dateValue.toLocaleDateString('en-US', { weekday: 'short' }),
      time: dateValue.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
    };
  });

  showMediaCount = signal(false);
  mediaCount = computed(() => this.entry().images?.length || 0);

  toggleMenu(event: MouseEvent) {
    event.stopPropagation();
    this.showMenu.update((v) => !v);
  }

  openEntry() {
    this.router.navigate(['/entry', this.entry().id]);
  }

  editEntry(event: MouseEvent) {
    event.stopPropagation();
    this.showMenu.set(false);
    this.router.navigate(['/new'], { queryParams: { id: this.entry().id } });
  }

  removeEntry(event: Event) {
    event.stopPropagation();
    this.showMenu.set(false);
    this.showDeleteModal.set(true);
  }

  handleDeleteDecision(confirmed: boolean) {
    this.showDeleteModal.set(false);

    if (confirmed) {
      this.journalService.deleteEntry(this.entry().id).subscribe({
        next: () => {
          this.toastr.show('Entry deleted successfully', 'success');
          this.journalService.refreshEntries();
        },
        error: () => this.toastr.show('Could not delete entry', 'error'),
      });
    }
  }
}
